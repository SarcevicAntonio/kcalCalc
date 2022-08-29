/// <reference lib="webworker" />

// Stolen fom https://dev.to/100lvlmaster/create-a-pwa-with-sveltekit-svelte-a36

import { build, files, version } from '$service-worker';

const worker = self as unknown as ServiceWorkerGlobalScope;

// `build` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = build.concat(files, '/_app/version.json', '/');
const staticAssets = new Set(to_cache);

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(version)
			.then((cache) => {
				return cache.addAll(to_cache);
			})
			.then(() => {
				worker.skipWaiting();
			})
	);
});

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== version) await caches.delete(key);
			}
			worker.clients.claim();
		})
	);
});

worker.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return;

	const url = new URL(event.request.url);

	const isStaticAsset = url.host === self.location.host && staticAssets.has(url.pathname);
	if (url.protocol.startsWith('http')) {
		event.respondWith(
			(async () => {
				// always serve static files and bundler-generated assets from cache.
				// if your application has other URLs with data that will never change,
				// set this variable to true for them and they will only be fetched once.
				const cachedAsset = isStaticAsset && (await caches.match(event.request));

				return cachedAsset || fetchAndCache(event.request);
			})()
		);
	}
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
	const cache = await caches.open(version);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;
		if (request.url.includes('www.google.com/images/cleardot.gif')) return new Response(null);

		throw err;
	}
}
