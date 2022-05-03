import { toISODateString } from '$lib/dateHelpers';
import { db } from '$lib/firebase';
import { calculateKcalFromItems } from '$lib/kcal';
import type { ItemInstance } from '$lib/stores/items';
import { asyncDerived } from '@square/svelte-store';
import { addDays, getISOWeek, getYear, setISOWeek, setYear, startOfISOWeek } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { user } from './user';

export interface Meal {
	label: string;
	intake: ItemInstance[];
}

export interface Day {
	// id: string;
	meals: Meal[];
}

export const defaultDay: Day = {
	meals: [
		{ label: 'Breakfast', intake: [] },
		{ label: 'Lunch', intake: [] },
		{ label: 'Dinner', intake: [] },
		{ label: 'Snacks', intake: [] },
	],
};

export interface DayWithKcal extends Day {
	kcal: number;
}

export interface Week {
	[date: string]: DayWithKcal;
}

export const curYear = writable(getYear(new Date()));
export const curWeek = writable(getISOWeek(new Date()));
export const curDay = writable(toISODateString(new Date()));

export const weekData = asyncDerived(
	[curYear, curWeek, user],
	async ([year, week, user]) => {
		const colRef = collection(db, `Users/${user.id}/Years/${year}/Weeks/${week}/Days`);
		const weekData = await getDocs(colRef);

		const data = {};
		let day = startOfISOWeek(setISOWeek(setYear(new Date(), year), week));
		for (let index = 0; index < 7; index++) {
			data[toISODateString(day)] = {};
			day = addDays(day, 1);
		}

		weekData.docs.forEach((doc) => {
			const docData = doc.data();
			data[doc.id] = {
				...docData,
				kcal: docData.meals.reduce(
					(acc: number, meal: Meal) => acc + calculateKcalFromItems(meal.intake),
					0
				),
			};
		});

		return data as Week;
	},
	true,
	{}
);
