import { db } from '$lib/firebase';
import { asyncWritable } from '@square/svelte-store';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { writable } from 'svelte/store';

export interface User {
	id: string;
	email: string;
	displayName: string;
	photoURL: string;
}

export const user = writable<User>(undefined);

export interface UserSettings {
	kcalLimit?: number;
}

export const userSettings = asyncWritable(
	[user],
	async ([$user]) => {
		console.log('getDoc userSettings');
		return (
			((await getDoc(doc(db, `Users/${$user.id}/Data/Settings`))).data() as UserSettings) ||
			({} as UserSettings)
		);
	},
	async (settings, [$user]) => {
		console.log('setDoc userSettings');
		await setDoc(doc(db, `Users/${$user.id}/Data/Settings`), settings);
	},
	true
);
