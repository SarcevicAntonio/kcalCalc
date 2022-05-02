import { db } from '$lib/firebase';
import { asyncReadable, asyncWritable } from '@square/svelte-store';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { get } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import { user } from './user';

export interface Item {
	owner?: string;
	createdAt?: number;
	updatedAt?: number;
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

export const items = asyncReadable(
	[],
	async () => {
		const snapshot = await getDocs(collection(db, `Items`));
		const data = [];
		snapshot.docs.forEach((doc) => {
			const docData = doc.data();
			data.push({ ...docData, id: doc.id });
		});
		return data;
	},
	true
);

export const recentItems = asyncReadable(
	[],
	async () => {
		const snapshot = await getDoc(doc(db, `Users/${get(user).id}/Data/RecentItems`));
		const data = snapshot.data()?.recentItems || [];
		return data as Item[];
	},
	true
);

export const createItemStore = (id: string) => {
	const store = asyncWritable(
		[],
		async () => (await getDoc(doc(db, `Items/${id}`))).data() as Item,
		async (data: Item) => {
			await setDoc(doc(db, `Items/${data.id}`), { ...data, updatedAt: Date.now() });
		}
	);
	return store;
};

export async function setRecentItem(mostRecentItem: Item) {
	let newRecentItems = get(recentItems).filter((item) => item.id !== mostRecentItem.id);
	newRecentItems.unshift(mostRecentItem);
	newRecentItems = newRecentItems.splice(0, 24);
	await setDoc(doc(db, `Users/${get(user).id}/Data/RecentItems`), { recentItems: newRecentItems });
	await recentItems.reload();
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
