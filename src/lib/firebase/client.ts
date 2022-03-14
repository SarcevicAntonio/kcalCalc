import { getApp, getApps, initializeApp } from 'firebase/app';
import {
	getAuth,
	inMemoryPersistence,
	isSignInWithEmailLink,
	sendSignInLinkToEmail,
	setPersistence,
	signInWithEmailLink
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

if (
	!import.meta.env.VITE_APIKEY ||
	!import.meta.env.VITE_AUTHDOMAIN ||
	!import.meta.env.VITE_PROJECTID ||
	!import.meta.env.VITE_STORAGEBUCKET ||
	!import.meta.env.VITE_MESSAGINGSENDERID ||
	!import.meta.env.VITE_APPID
) {
	throw new Error('Firebase client environment variables are not set!');
}

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY as string,
	authDomain: import.meta.env.VITE_AUTHDOMAIN as string,
	projectId: import.meta.env.VITE_PROJECTID as string,
	storageBucket: import.meta.env.VITE_STORAGEBUCKET as string,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID as string,
	appId: import.meta.env.VITE_APPID as string
};

export function getClientApp() {
	if (getApps().length) {
		const db = getFirestore();
		return { app: getApp(), db };
	}
	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	setPersistence(auth, inMemoryPersistence);
	const db = getFirestore();

	return { app, db };
}

export function sendMagicLink(email: string, redirectUlr: string) {
	const auth = getAuth(getClientApp().app);
	return sendSignInLinkToEmail(auth, email, {
		url: redirectUlr,
		handleCodeInApp: true
	});
}

export function isLinkMagic(link: string) {
	const auth = getAuth(getClientApp().app);
	return isSignInWithEmailLink(auth, link);
}

export function signInWithMagicLink(email: string, link: string) {
	const auth = getAuth(getClientApp().app);
	return signInWithEmailLink(auth, email, link);
}
