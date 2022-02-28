import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCXuikdXYva-Qc4KuH8TwvIQqKnmnehZEc',
	authDomain: 'kcalcalcapp.firebaseapp.com',
	projectId: 'kcalcalcapp',
	storageBucket: 'kcalcalcapp.appspot.com',
	messagingSenderId: '964051329231',
	appId: '1:964051329231:web:39a402c1c03874e17b17ba'
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();