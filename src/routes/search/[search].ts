import type { RequestHandler } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

export const get: RequestHandler = async (request) => {
	const fetchRequest = await fetch(
		'https://fddb.mobi/search/?lang=de&search=' + request.params.search
	);
	if (!fetchRequest.ok)
		return { status: fetchRequest.status, error: new Error(fetchRequest.statusText) };
	const { document } = parseHTML(await fetchRequest.text());
	const body = [];
	document.querySelectorAll('div table').forEach((item) => {
		const entry = {
			title: '',
			units: []
		};
		item.querySelectorAll('b').forEach((bold) => {
			if (!bold.nextSibling) {
				entry.title = bold.textContent;
			} else {
				entry.units.push({
					unit: bold.textContent.replace(':', ''),
					kcal: bold.nextSibling.textContent.match(/\((.+) kcal\)/)[1]
				});
			}
		});
		body.push(entry);
	});

	return {
		body
	};
};
