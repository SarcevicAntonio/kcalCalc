import { dbADMIN } from '$lib/firebase-admin';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, locals }) => {
	const collection = await dbADMIN.collection(`Items`).get();

	const data = {};

	collection.docs.forEach((doc) => {
		const docData = doc.data();
		data[doc.id] = docData;
	});

	return {
		body: {
			data,
		},
	};
};
