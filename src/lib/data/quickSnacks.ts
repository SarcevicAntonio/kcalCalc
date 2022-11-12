import { transformItemToInstance } from '$lib/components/InstanceCreator';
import { toISODateString } from '$lib/dateHelpers';
import { db } from '$lib/firebase';
import { getStorage, setStorage } from '$lib/localStorage';
import { asyncWritable } from '@square/svelte-store';
import { notification, removeNotification } from 'as-comps';
import type { Unsubscribe } from 'firebase/auth';
import { doc, DocumentReference, onSnapshot, setDoc } from 'firebase/firestore';
import { derived, get } from 'svelte/store';
import { getDayData, setDayData } from './intake';
import { items, type ItemInstance } from './items';
import { user } from './user';
import { v4 as uuid } from 'uuid';

const QUICK_SNACK_STORAGE_KEY = 'v1/quickSnacks';

let docRef: DocumentReference;
export const quickSnacks = asyncWritable<typeof user, QuickSnacks>(user, async ($user) => {
	if (unsubscribeQuickSnacks) {
		unsubscribeQuickSnacks();
	}
	docRef = doc(db, `Users/${$user.id}/Data/QuickSnacks`);
	subscribeQuickSnacks(docRef);
	return getStorage(QUICK_SNACK_STORAGE_KEY, {}) as QuickSnacks;
});

let unsubscribeQuickSnacks: Unsubscribe;

function subscribeQuickSnacks(docRef: DocumentReference) {
	unsubscribeQuickSnacks = onSnapshot(docRef, (docSnap) => {
		console.log('onSnapshot quickSnacks');
		const data = docSnap.data() || {};
		quickSnacks.set(data, false);
		setStorage(QUICK_SNACK_STORAGE_KEY, data);
	});
}

export const quickSnackTemplates = derived([quickSnacks, items], ([$quickSnacks, $items]) => {
	console.log('ayyyoo')
	const templates: QuickSnackTemplate[] = [];
	if (!$quickSnacks || !$items?.length) return [];
	Object.entries($quickSnacks).forEach(([itemId, portionKeys]) => {
		const item = $items.find((i) => i.id === itemId);
		if (!item || !item.portions) return [];
		const portions = item.portions.filter((p) => portionKeys.includes(p.key));
		portions.forEach((p) => {
			templates.push({
				...transformItemToInstance(item),
				amount: p.amount,
				portionLabel: p.label,
			});
		});
	});
	return templates;
});

const MEAL_LABEL_SNACK = 'Snacks';

export async function trackQuickSnack(itemInstance: QuickSnackTemplate) {
	itemInstance.key = uuid();
	const notificationId = notification(`Tracking ${itemInstance.label}...`);
	const todayDate = toISODateString(new Date());
	const todayData = await getDayData(todayDate);
	const mealIndex = todayData.meals.findIndex((meal) => meal.label === MEAL_LABEL_SNACK);
	todayData.meals[mealIndex].intake = [...todayData.meals[mealIndex].intake, itemInstance];
	await setDayData(todayDate, todayData);
	removeNotification(notificationId);
}

export function addQuickSnack(itemId: string, portionKey: string) {
	if (!docRef) throw new Error("Can't add quick snack without docRef");
	const data = get(quickSnacks);
	if (!data[itemId]) data[itemId] = [];
	data[itemId].push(portionKey);
	setDoc(docRef, data);
}

export function removeQuickSnack(itemId: string, portionKey: string) {
	if (!docRef) throw new Error("Can't add quick snack without docRef");
	const data = get(quickSnacks);
	if (!data[itemId]) return;
	console.log('###');
	data[itemId] = data[itemId].filter((pk) => pk !== portionKey);
	setDoc(docRef, data);
}

export interface QuickSnacks {
	[itemId: string]: string[];
}

export interface QuickSnackTemplate extends ItemInstance {
	portionLabel: string;
}
