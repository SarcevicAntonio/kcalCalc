import { db } from '$lib/firebase';
import { getStorage, setStorage } from '$lib/localStorage';
import { asyncWritable } from '@square/svelte-store';
import { get } from 'svelte/store';
import type { Unsubscribe } from 'firebase/auth';
import { doc, DocumentReference, onSnapshot, setDoc } from 'firebase/firestore';
import { user } from './user';

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

export interface QuickSnacks {
	[itemId: string]: string[];
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
