import { auth } from '$lib/firebase';
import type { User } from 'firebase/auth';
import { readable } from 'svelte/store';

export const user = readable<string | User>('INIT', (set) => {
	auth.onAuthStateChanged((userChanged) => {
		console.log('user', userChanged);
		set(userChanged);
	});
});
