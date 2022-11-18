export const encodeObjToUriComponent = (obj: unknown): string => {
	const json = JSON.stringify(obj)
	const encoded = window.btoa(json)
	return encodeURIComponent(encoded)
}

export const decodeUriComponentToObj = (encoded: string): unknown => {
	const decodedUriComponent = decodeURIComponent(encoded)
	const decoded = window.atob(decodedUriComponent)
	return JSON.parse(decoded)
}
