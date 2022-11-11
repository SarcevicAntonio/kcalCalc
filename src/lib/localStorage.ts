export function setStorage(key: string, obj: unknown) {
	const json = JSON.stringify(obj);
	localStorage.setItem(key, json);
}

export function getStorage(key: string, fallback = {}) {
	const json = localStorage.getItem(key);
	if (!json) return fallback;
	try {
		return JSON.parse(json);
	} catch (e) {
		return fallback;
	}
}
