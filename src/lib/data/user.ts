import { db } from '$lib/firebase';
import { asyncWritable } from '@square/svelte-store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export const user = writable<User>(undefined);

export const userSettings = asyncWritable(
	[user],
	async ([$user]) => {
		const docRef = doc(db, `Users/${$user.id}/Data/Settings`);
		console.log('getDoc userSettings');
		const docSnap = await getDoc(docRef);
		return (docSnap.data() || {}) as UserSettings;
	},
	async (settings, [$user]) => {
		console.log('setDoc userSettings');
		const docRef = doc(db, `Users/${$user.id}/Data/Settings`);
		await setDoc(docRef, settings);
	},
	true
);

export interface User {
	id: string;
	email: string;
	displayName: string;
	photoURL: string;
}

export interface UserSettings {
	kcalLimit?: number;
}
