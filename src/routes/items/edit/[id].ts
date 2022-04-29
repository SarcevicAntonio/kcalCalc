import { dbADMIN } from '$lib/firebase-admin';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params }) => {
	const data = (await dbADMIN.doc(`Items/${params.id}`).get()).data();

	return {
		body: {
			data,
		},
	};
};
