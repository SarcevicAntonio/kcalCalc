import { toISODateString } from '$lib/dateHelpers';
import { db } from '$lib/firebase';
import { calculateKcalFromItems } from '$lib/kcal';
import type { ItemInstance } from '$lib/data/items';
import { asyncDerived } from '@square/svelte-store';
import {
	addDays,
	getISOWeek,
	getYear,
	isSameDay,
	setISOWeek,
	setYear,
	startOfISOWeek,
} from 'date-fns';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { derived, get, writable } from 'svelte/store';
import { user } from './user';

export const curDay = writable(toISODateString(new Date()));
export const dateIsToday = derived(curDay, (day) => isSameDay(new Date(day), new Date()));
export const curYear = derived(curDay, (day) => getYear(new Date(day)));
export const curWeek = derived(curDay, (day) => getISOWeek(new Date(day)));

export const weekData = asyncDerived(
	[curYear, curWeek, user],
	async ([year, week, user]) => {
		// build skeleton data
		const data = {};
		let day = startOfISOWeek(setISOWeek(setYear(new Date(), year), week));
		for (let index = 0; index < 7; index++) {
			data[toISODateString(day)] = defaultDay;
			day = addDays(day, 1);
		}

		const colRef = collection(db, `Users/${user.id}/Years/${year}/Weeks/${week}/Days`);
		console.log('getDocs weekData', year, week);
		const querySnap = await getDocs(colRef);

		// replace skeleton data with real data
		querySnap.docs.forEach((doc) => {
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

export const getDayData = async (date: string): Promise<Day> => {
	const dateObj = new Date(date);
	const year = getYear(dateObj);
	const week = getISOWeek(dateObj);
	const docRef = doc(db, `Users/${get(user).id}/Years/${year}/Weeks/${week}/Days/${date}`);
	console.log('getDoc getDayData', date, year, week);
	const docSnap = await getDoc(docRef);
	return (docSnap.data() as Day) || defaultDay;
};

export const setDayData = async (date: string, data: Day) => {
	const dateObj = new Date(date);
	const week = getISOWeek(dateObj);
	const year = getYear(dateObj);
	const docRef = doc(db, `Users/${get(user).id}/Years/${year}/Weeks/${week}/Days/${date}`);
	console.log('setDoc updateData', date);
	await setDoc(docRef, data);
};

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
