import { getTokenFromCookie } from '$lib/firebase/admin';
import type { GetSession, Handle } from '@sveltejs/kit';

export const getCookieValue = (cookie: string | null, name: string): string | null =>
	cookie?.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || null;

export const handle: Handle = async ({ event, resolve }) => {
	const cookie = event.request.headers.get('cookie');

	event.locals.token = await getTokenFromCookie(getCookieValue(cookie, 'session'));
	return resolve(event);
};

export const getSession: GetSession = ({ locals }) => {
	const user = locals.token
		? {
				id: locals.token.sub,
				email: locals.token.email
		  }
		: null;
	return { user };
};
