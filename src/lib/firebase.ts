import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_PROJECTID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_APPID,
	databaseURL: import.meta.env.VITE_DATABASEURL,
};

if (!firebaseConfig.apiKey) {
	throw new Error('VITE_APIKEY is not set');
}

export function getClient() {
	let app = undefined;
	if (getApps().length) {
		app = getApp();
	} else {
		app = initializeApp(firebaseConfig);
	}
	if (!app) throw new Error('something went wrong with app: ' + JSON.stringify(app, null, 2));

	const auth = getAuth(app);
	setPersistence(auth, inMemoryPersistence);

	const db = getFirestore();

	return { app, db, auth };
}

export const app = getClient().app;
export const auth = getClient().auth;
export const db = getClient().db;
