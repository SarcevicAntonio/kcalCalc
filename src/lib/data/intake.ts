import type { ItemInstance } from '$lib/data/items'
import { toISODateString } from '$lib/dateHelpers'
import { db } from '$lib/firebase'
import { calculateKcalFromItems } from '$lib/kcal'
import { getStorage, setStorage } from '$lib/localStorage'
import { asyncDerived, asyncWritable } from '@square/svelte-store'
import {
	addDays,
	getISOWeek,
	getYear,
	isSameDay,
	setISOWeek,
	setYear,
	startOfISOWeek,
} from 'date-fns'
import {
	collection,
	CollectionReference,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
	type Unsubscribe,
} from 'firebase/firestore'
import { derived, get, writable } from 'svelte/store'
import { user } from './user'

const WEEK_DATA_STORAGE_KEY = 'v1/weekData'

export const curDay = writable(toISODateString(new Date()))
export const dateIsToday = derived(curDay, (day) => isSameDay(new Date(day), new Date()))
export const curYear = derived(curDay, (day) => getYear(new Date(day)))
export const curWeek = derived(curDay, (day) => getISOWeek(new Date(day)))

export const weekData = asyncWritable(
	[curYear, curWeek, user],
	async ([year, week, user]) => {
		if (unsubscribeWeekData) unsubscribeWeekData()

		// build skeleton data
		const data = {}
		let day = startOfISOWeek(setISOWeek(setYear(new Date(), year), week))
		for (let index = 0; index < 7; index++) {
			data[toISODateString(day)] = structuredClone(defaultDay)
			day = addDays(day, 1)
		}

		const colRef = collection(db, `Users/${user.id}/Years/${year}/Weeks/${week}/Days`)
		subscribeWeekData(colRef, data)
		return getStorage(WEEK_DATA_STORAGE_KEY, data) as Week
	},
	null,
	false,
	{}
)

let unsubscribeWeekData: Unsubscribe

function subscribeWeekData(colRef: CollectionReference, data: Week) {
	unsubscribeWeekData = onSnapshot(colRef, (querySnap) => {
		console.log('onSnapshot weekData')
		querySnap.docs.forEach((doc) => {
			const docData = doc.data() as Day
			data[doc.id] = {
				...docData,
				kcal: docData.meals.reduce(
					(acc: number, meal: Meal) => acc + calculateKcalFromItems(meal.intake),
					0
				),
			}
		})
		weekData.set(data, false)
		setStorage(WEEK_DATA_STORAGE_KEY, data)
	})
}

export const dayData = asyncDerived([weekData, curDay], async ([weekData, curDay]) => {
	return weekData[curDay]
})

/** for one off use */
export const getDayData = async (date: string): Promise<Day> => {
	const dateObj = new Date(date)
	const year = getYear(dateObj)
	const week = getISOWeek(dateObj)
	const docRef = doc(db, `Users/${get(user).id}/Years/${year}/Weeks/${week}/Days/${date}`)
	console.log('getDoc getDayData', date, year, week)
	const docSnap = await getDoc(docRef)
	return (docSnap.data() as Day) || defaultDay
}

export const setDayData = async (date: string, data: Day) => {
	const dateObj = new Date(date)
	const week = getISOWeek(dateObj)
	const year = getYear(dateObj)
	const docRef = doc(db, `Users/${get(user).id}/Years/${year}/Weeks/${week}/Days/${date}`)
	console.log('setDoc updateData', date)
	await setDoc(docRef, data)
}

export interface Meal {
	label: string
	intake: ItemInstance[]
}

export interface Day {
	// id: string;
	meals: Meal[]
}

export const defaultDay: Day = {
	meals: [
		{ label: 'Breakfast', intake: [] },
		{ label: 'Lunch', intake: [] },
		{ label: 'Dinner', intake: [] },
		{ label: 'Snacks', intake: [] },
	],
}

export interface DayWithKcal extends Day {
	kcal: number
}

export interface Week {
	[date: string]: DayWithKcal
}
