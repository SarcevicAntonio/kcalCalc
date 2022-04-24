import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase/firestore';

const adminCreds = {
	projectId: import.meta.env.VITE_PROJECTID as string,
	clientEmail: import.meta.env.VITE_ADMIN_CLIENT_EMAIL as string,
	privateKey: (import.meta.env.VITE_ADMIN_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
};

if (!adminCreds.clientEmail) {
	throw new Error('VITE_FIRE_ADMIN_EMAIL is not set');
}

export function getAdmin() {
	let app = undefined;
	if (getApps().length) {
		app = getApp();
	} else {
		app = initializeApp({
			credential: cert(adminCreds),
		});
	}

	if (!app) throw new Error('something went wrong with app: ' + JSON.stringify(app, null, 2));

	const auth = getAuth();
	const db = getFirestore();

	return { app, db, auth };
}

export const appADMIN = getAdmin().app;
export const authADMIN = getAdmin().auth;
export const dbADMIN = getAdmin().db;

export function getTokenFromCookie(cookie: string | null) {
	if (!cookie) return null;

	return authADMIN.verifySessionCookie(cookie).catch(() => null);
}

export function verifyToken(token: string) {
	return authADMIN.verifyIdToken(token);
}

export async function createSessionCookie(token: string, maxAge: number) {
	const expiresIn = maxAge * 1000;
	const session = await authADMIN.createSessionCookie(token, {
		expiresIn,
	});

	return `session=${session}; SameSite=Strict; Path=/; HttpOnly; Max-Age=${maxAge};`;
}
