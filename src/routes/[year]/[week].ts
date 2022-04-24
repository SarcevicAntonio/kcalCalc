import { toISODateString } from '$lib/dateHelpers';
import { dbADMIN } from '$lib/firebase-admin';
import { calculateKcalFromItems } from '$lib/kcal';
import type { Meal } from '$lib/stores/intake';
import type { RequestHandler } from '@sveltejs/kit';
import { addDays, setISOWeek, setYear, startOfISOWeek } from 'date-fns';

export const get: RequestHandler = async ({ params, locals }) => {
	const collection = await dbADMIN
		.collection(`Users/${locals.token.user_id}/Years/${params.year}/Weeks/${params.week}/Days`)
		.get();

	const data = {};
	let day = startOfISOWeek(setISOWeek(setYear(new Date(), +params.year), +params.week));
	for (let index = 0; index < 7; index++) {
		data[toISODateString(day)] = {};
		day = addDays(day, 1);
	}

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
