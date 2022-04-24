import { dbADMIN } from '$lib/firebase-admin';
import { calculateKcalFromItems } from '$lib/kcal';
import type { Meal } from '$lib/stores/intake';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, locals }) => {
	const collection = await dbADMIN
		.collection(`Users/${locals.token.user_id}/Years/${params.year}/Weeks/${params.week}/Days`)
		.get();

	const data = {};

	collection.docs.forEach((doc) => {
		const docData = doc.data();
		data[doc.id] = {
			...docData,
			kcal: docData.meals.reduce(
				(acc: number, meal: Meal) => acc + calculateKcalFromItems(meal.intake),
				0
			),
		};
	});

	return {
		body: {
			data,
		},
	};
};
