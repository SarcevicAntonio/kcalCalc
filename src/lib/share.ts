import { notification } from 'as-comps'
import { encodeObjToUriComponent } from './base64'
import { flattenItem, type Item } from './data/items'

export function shareItem(item: Item) {
	const share = flattenItem(item)
	const uriComponent = encodeObjToUriComponent(share)
	const url = new URL(window.location.toString())
	url.searchParams.set('add', uriComponent)

	const shareInfo = {
		title: item.label,
		text: `Add "${item.label}" as a kcalCalc Item:`,
		url: url.href,
	}

	if ((navigator as Navigator).share) {
		;(navigator as Navigator).share(shareInfo)
	} else {
		;(navigator as Navigator).clipboard.writeText([shareInfo.text, '', shareInfo.url].join('\n'))
		notification('Copied Item URL to clipboard.')
	}
}
