import { browser } from '$app/env';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';

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

function getClient() {
	if (getApps().length) {
		return getApp();
	} else {
		const app = initializeApp(firebaseConfig);
		const db = getFirestore(app);
		if (browser) enableIndexedDbPersistence(db);
		return app;
	}
}

export const app = getClient();
export const auth = getAuth(getClient());
export const db = getFirestore(getClient());
