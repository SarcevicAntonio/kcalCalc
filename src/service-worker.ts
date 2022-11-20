/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope

import { build, files, prerendered, version } from '$service-worker'
import {
	cleanupOutdatedCaches,
	precacheAndRoute,
	type PrecacheEntry,
} from 'workbox-precaching'

self.addEventListener('message', event => {
	if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

const precache_list: PrecacheEntry[] = [...build, ...files, ...prerendered].map(
	s => ({
		url: s,
		revision: version,
	})
)

precacheAndRoute(precache_list)

cleanupOutdatedCaches()
