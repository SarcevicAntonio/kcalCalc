import type { Ingredient } from '$lib/stores/ingredients';
import type { RequestHandler } from '@sveltejs/kit';
import { parseHTML } from 'linkedom';

export const get: RequestHandler = async (request) => {
	const searchRes = await fetch(
		'https://fddb.mobi/search/?lang=de&search=' + request.params.search
	);
	if (!searchRes.ok) {
		return { status: searchRes.status, error: new Error(searchRes.statusText) };
	}
	const { document } = parseHTML(await searchRes.text());

	const ingredients: Ingredient[] = [];

	const requests = Array.from(document.querySelectorAll('td a')).map((a: HTMLAnchorElement) => {
		return fetch('https://fddb.mobi' + a.href).then(async (itemRes) => {
			if (!itemRes.ok) {
				return { status: itemRes.status, error: new Error(itemRes.statusText) };
			}

			const { document } = parseHTML(await itemRes.text());

			const label = document.querySelector('h3').textContent;
			let kcalPer100 = 0;

			document.querySelectorAll('tr').forEach((tr) => {
				if (tr.textContent.startsWith('Kalorien')) {
					kcalPer100 = +tr.children[1].textContent.split(' ')[0];
				}
			});

			if (kcalPer100 > 0) {
				ingredients.push({
					docId: 'FFDB_' + label,
					label,
					kcalPer100
				});
			}
		});
	});

	return Promise.all(requests).then(() => {
		return {
			body: JSON.stringify(ingredients)
		};
	});
};
