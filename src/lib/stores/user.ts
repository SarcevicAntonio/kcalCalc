import { session } from '$app/stores';
import { derived, type Writable } from 'svelte/store';

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
