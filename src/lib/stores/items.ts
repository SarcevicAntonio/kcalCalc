import { db } from '$lib/firebase';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { get } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import { user } from './user';

export interface Item {
	id: string;
	label: string;
	brand?: string;
	kcalPer100: number;
	amount: number;
	items?: ItemInstance[];
	portions?: Portion[];
}

export interface ItemInstance {
	key?: string;
	id: string;
	label: string;
	brand?: string;
	kcalPer100: number;
	amount: number;
	portions?: Portion[];
}

export interface Portion {
	key?: string;
	label: string;
	amount: number;
}

export async function getItems(): Promise<Item[]> {
	const snapshot = await getDocs(collection(db, `Items`));
	const data = [];
	snapshot.docs.forEach((doc) => {
		const docData = doc.data();
		data.push({ ...docData, id: doc.id });
	});
	return data;
}

export async function setRecentItem(mostRecentItem: Item) {
	let recentItems = (await getRecentItems()).filter((item) => item.id !== mostRecentItem.id);
	recentItems.unshift(mostRecentItem);
	recentItems = recentItems.splice(0, 24);
	await setDoc(doc(db, `Users/${get(user).id}/Data/RecentItems`), { recentItems });
}

export async function getRecentItems(): Promise<Item[]> {
	const snapshot = await getDoc(doc(db, `Users/${get(user).id}/Data/RecentItems`));
	const data = snapshot.data()?.recentItems || [];
	return data as Item[];
}

export async function saveExternalItem(item: Item) {
	item.id = `FDDB_${item.label}_${item.brand}`;
	if ((await getDocs(query(collection(db, `Items`), where('id', '==', item.id)))).docs.length) {
		return;
	}
	item.items = [];
	item.portions = item.portions ? item.portions.map((p) => ({ ...p, key: uuid() })) : [];
	await setDoc(doc(db, 'Items/' + item.id), item);
}

export const defaultItem = {
	id: '',
	label: '',
	brand: '',
	kcalPer100: 0, // 0 means no override
	amount: 0, // 0 means no override
	items: [],
	portions: [],
};

export const defaultPortion = {
	key: '',
	label: '',
	amount: 0,
};

export const customKcalCountItem = {
	id: 'CUSTOM:KCAL_COUNT',
	label: '',
	kcalPer100: 100, // no input- stays at 100 so amount functions as kcal input
	amount: 100,
};

export const customKcalAmountItem = {
	id: 'CUSTOM:KCAL+AMOUNT',
	label: '',
	kcalPer100: 100,
	amount: 100,
};

export const items: Item[] = [
	{
		id: '1',
		label: 'Brot town',
		brand: 'asdf laden',
		kcalPer100: 0, // 0 means no override
		amount: 0, // 0 means no override
		items: [
			{
				id: '1234',
				label: 'Leerdammer, Original',
				brand: 'Bel',
				kcalPer100: 283,
				amount: 20,
			},
			{
				id: '4312',
				label: 'Emmer-Dinkelbrot',
				brand: "Essmann's Backstube",
				kcalPer100: 312,
				amount: 20,
			},
		],
		portions: [
			{
				label: 'Scheibe',
				amount: 40,
			},
		],
	},
	{
		id: '2',
		label: 'Brot Laden',
		brand: 'asdf town',
		kcalPer100: 300, // 0 means no override
		amount: 0, // 0 means no override
		items: [],
		portions: [],
	},
];
