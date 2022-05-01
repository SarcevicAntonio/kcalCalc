import { browser } from '$app/env';
import { session } from '$app/stores';
import { db } from '$lib/firebase';
import { asyncWritable } from '@square/svelte-store';
import { doc, getDoc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import { derived, get, type Writable } from 'svelte/store';

export interface User {
	id: string;
	email: string;
}

export const user = derived<Writable<App.Session>, User>(session, ($session, set) => {
	set($session.user);
});

export function setUser(user: User | null) {
	session.update(($session) => ({ ...$session, user }));
}

export interface UserSettings {
	kcalLimit?: number;
}

export const userSettings = asyncWritable(
	user,
	async ($user) => {
		if (!sub && browser) setSubscription();
		return (await getDoc(doc(db, `Users/${$user.id}/Data/Settings`))).data() as UserSettings || {} as UserSettings;
	},
	async (settings) => {
		await setDoc(doc(db, `Users/${get(user).id}/Data/Settings`), settings);
	},
	true
);

let sub: Unsubscribe;
function setSubscription() {
	sub = onSnapshot(doc(db, `Users/${get(user).id}/Data/Settings`), () => {
		userSettings.reload();
	});
}
