import { browser } from '$app/environment';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
	connectFirestoreEmulator,
	enableIndexedDbPersistence,
	getFirestore,
} from 'firebase/firestore';

const useEmulation = import.meta.env.VITE_USE_EMULATION;

const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	databaseURL: import.meta.env.VITE_DATABASEURL,
	projectId: import.meta.env.VITE_PROJECTID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_APPID,
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
		const auth = getAuth(app);
		if (useEmulation && browser) {
			const { hostname } = window.location;
			const url = 'http://' + hostname;
			connectAuthEmulator(auth, url + ':9099');
			connectFirestoreEmulator(db, hostname, 8081);
		}
		if (browser) enableIndexedDbPersistence(db);
		return app;
	}
}

export const app = getClient();
export const auth = getAuth(getClient());
export const db = getFirestore(getClient());
