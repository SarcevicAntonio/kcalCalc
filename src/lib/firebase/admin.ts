import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (
	!import.meta.env.VITE_PROJECTID ||
	!import.meta.env.VITE_ADMIN_CLIENT_EMAIL ||
	!import.meta.env.VITE_ADMIN_PRIVATE_KEY
) {
	throw new Error('Firebase admin environment variables are not set!');
}

const firebaseAdminConfig = {
	credential: cert({
		projectId: import.meta.env.VITE_PROJECTID as string,
		clientEmail: import.meta.env.VITE_ADMIN_CLIENT_EMAIL as string,
		privateKey: (import.meta.env.VITE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, '\n')
	})
};

export function getAdminApp() {
	return getApps().length ? getApp() : initializeApp(firebaseAdminConfig);
}

export function verifyToken(token: string) {
	const auth = getAuth(getAdminApp());
	return auth.verifyIdToken(token);
}

export async function createSessionCookie(token: string, maxAge: number) {
	const expiresIn = maxAge * 1000;
	const auth = getAuth(getAdminApp());
	const session = await auth.createSessionCookie(token, {
		expiresIn
	});

	return `session=${session}; SameSite=Strict; Path=/; HttpOnly; Max-Age=${maxAge};`;
}

export function getTokenFromCookie(cookie: string | null) {
	if (!cookie) return null;

	const auth = getAuth(getAdminApp());
	return auth.verifySessionCookie(cookie).catch(() => null);
}
