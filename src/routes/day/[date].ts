import { dbADMIN } from '$lib/firebase-admin';
import { defaultDay } from '$lib/stores/intake';
import type { RequestHandler } from '@sveltejs/kit';
import { getISOWeek, getYear } from 'date-fns';

export const get: RequestHandler = async ({ params, locals }) => {
	const dateObj = new Date(params.date);
	const year = getYear(dateObj);
	const week = getISOWeek(dateObj);

	let data = (
		await dbADMIN
			.doc(`Users/${locals.token.user_id}/Years/${year}/Weeks/${week}/Days/${params.date}`)
			.get()
	).data();

	console.log(params.date);

	if (!data) {
		data = defaultDay;
	}

	return {
		body: {
			data,
		},
	};
};
