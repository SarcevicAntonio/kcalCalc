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

	const requests = Array.from(document.querySelectorAll('td a')).map(async (a: HTMLAnchorElement) => {
		return fetch('https://fddb.mobi' + a.href).then(async (itemRes) => {
			if (!itemRes.ok) {
				return { status: itemRes.status, error: new Error(itemRes.statusText) };
			}

			const { document } = parseHTML(await itemRes.text());

			const title = document.querySelector('h3').textContent;
			const brand = document.querySelector('p').textContent.match(/\(.+\)/);
			const label = title + ' ' + brand;

			let kcalPer100 = 0;

			document.querySelectorAll('tr').forEach((tr) => {
				if (tr.textContent.startsWith('Kalorien')) {
					kcalPer100 = +tr.children[1].textContent.split(' ')[0];
				}
			});

			const portions: Ingredient['portions'] = [];

			document.querySelectorAll('h4').forEach((h4) => {
				if (h4.textContent.includes('Portionen')) {
					let ref = h4.nextElementSibling;
					while (ref.nodeName === 'DIV') {
						const split = ref.querySelector('td b').textContent.split('(');

						const label = split[0].trim();
						const amount = +split[1].split(' ')[0];

						if (amount !== 100) {
							portions.push({ label, amount });
						}

						ref = ref.nextElementSibling;
					}
				}
			});

			if (kcalPer100 > 0) {
				const ingredient = {
					docId: 'FDDB_' + label,
					label,
					kcalPer100,
					portions
				};

				ingredients.push(ingredient);
			}
		});
	});

	return Promise.all(requests).then(() => {
		return {
			body: JSON.stringify(ingredients)
		};
	});
};
