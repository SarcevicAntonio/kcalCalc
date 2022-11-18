import { browser } from '$app/environment'

export function setStorage(key: string, obj: unknown): void {
	if (!browser) return
	const json = JSON.stringify(obj)
	localStorage.setItem(key, json)
}

export function getStorage(key: string, fallback = {}): unknown {
	if (!browser) return fallback
	const json = localStorage.getItem(key)
	if (!json) return fallback
	try {
		return JSON.parse(json)
	} catch (e) {
		return fallback
	}
}
