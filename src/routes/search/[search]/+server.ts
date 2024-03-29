import type { Item } from '$lib/data/items'
import type { RequestHandler } from '@sveltejs/kit'
import { parseHTML } from 'linkedom'

// polyfill for vercel
if (!String.prototype.replaceAll) {
	String.prototype.replaceAll = function (str, newStr) {
		return this.replace(new RegExp(str, 'g'), newStr)
	}
}

export const GET: RequestHandler = async (request) => {
	// console.log('https://fddb.mobi/search/?search=' + request.params.search);
	const searchRes = await fetch(
		'https://fddb.mobi/search/?search=' + request.params.search
	)
	if (!searchRes.ok) {
		return new Response(undefined, {
			status: searchRes.status,
			statusText: searchRes.statusText,
		})
	}
	const { document } = parseHTML(await searchRes.text())

	const ingredients = []

	const requests = Array.from(document.querySelectorAll('td a')).map(
		async (a: HTMLAnchorElement) => {
			return fetch('https://fddb.mobi' + a.href).then(async (itemRes) => {
				if (!itemRes.ok) {
					return
				}

				const { document } = parseHTML(await itemRes.text())

				const label = document.querySelector('h3').textContent
				const brand = document
					.querySelector('p')
					.textContent.match(/\((.+)\)/)[1]

				let kcalPer100 = 0
				let proteinPer100 = 0

				document.querySelectorAll('tr').forEach((tr) => {
					if (tr.textContent.startsWith('Kalorien')) {
						kcalPer100 = +tr.children[1].textContent.split(' ')[0]
					}
					if (tr.textContent.startsWith('Protein')) {
						proteinPer100 = +tr.children[1].textContent
							.split(' ')[0]
							.replace(',', '.')
					}
				})

				const portions = []

				document.querySelectorAll('h4').forEach((h4) => {
					if (h4.textContent.includes('Portionen')) {
						let ref = h4.nextElementSibling
						while (ref.nodeName === 'DIV') {
							const split = ref.querySelector('td b').textContent.split('(')

							const label = split[0].trim()
							const amount = +split[1].split(' ')[0].replaceAll(',', '.')

							if (amount !== 100) {
								portions.push({ label, amount })
							}

							ref = ref.nextElementSibling
						}
					}
				})

				const itemFddbId = a.href.split('/')[2].slice(0, -5)
				// console.log(`https://fddb.info/db/de/lebensmittel/${itemFddbId}/index.html`);
				const possibleEan = await fetch(
					`https://fddb.info/db/de/lebensmittel/${itemFddbId}/index.html`
				)
					.then(async (detailsRes) => {
						if (!detailsRes.ok) return null
						const { document } = parseHTML(await detailsRes.text())
						const pWithEan = Array.from(document.querySelectorAll('p')).find(
							(p) => p.textContent.includes('EAN:')
						)
						if (!pWithEan) return null
						return pWithEan.textContent.match(/EAN: ([0-9]+)/)[1]
					})
					.catch(() => null)

				if (kcalPer100 > 0) {
					const ingredient: Item = {
						id: `FDDB${a.href.replaceAll('/', '\\')}`,
						label,
						brand,
						kcalPer100,
						...(proteinPer100 ? { proteinPer100 } : {}),
						portions,
					}

					if (possibleEan) ingredient.ean = +possibleEan

					ingredients.push(ingredient)
				}
			})
		}
	)

	await Promise.all(requests)
	return new Response(JSON.stringify(ingredients))
}
