import { getItems } from '$lib/stores/items';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	const data = await getItems();
	return {
		body: {
			data: data as any,
		},
	};
};
