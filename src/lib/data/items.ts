import { createInstance } from '$lib/components/InstanceCreator';
import { db } from '$lib/firebase';
import { calculateKcalPer100FromItems } from '$lib/kcal';
import { asyncDerived, asyncWritable } from '@square/svelte-store';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { get } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import { user } from './user';

export const items = asyncDerived<typeof user, Item[]>(
	user,
	async ($user) => {
		const colRef = collection(db, `Users/${$user.id}/Items`);
		console.count('getDocs items');
		const snapshot = await getDocs(colRef);
		const data: Item[] = [];
		snapshot.docs.forEach((doc) => {
			const docData = doc.data();
			data.push({ ...(docData as Item), id: doc.id });
		});
		return data;
	},
	true
);

export const createItem = (id: string): Item => {
	const colRef = doc(db, `Users/${get(user).id}/Items/` + id);
	console.log('setDoc newItem', id);
	const item = {
		...defaultItem,
		id,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
	setDoc(colRef, item);
	return item;
};

export const createItemStore = (item: Item) => {
	const id = item.id;
	const store = asyncWritable<[], Item>(
		[],
		async () => {
			const docRef = doc(db, `Users/${get(user).id}/Items/${id}`);
			console.log('getDoc new ItemStore', id);
			const docSnap = await getDoc(docRef);
			return docSnap.data() as Item;
		},
		async (data: Item) => {
			const docRef = doc(db, `Users/${get(user).id}/Items/${data.id}`);
			console.log('setDoc ItemStore', id);
			await setDoc(docRef, { ...data, updatedAt: Date.now() });
		},
		true,
		item
	);
	return store;
};

export const deleteItem = (id: string) => {
	const docRef = doc(db, `Users/${get(user).id}/Items/${id}`);
	console.log('deleteDoc', id);
	return deleteDoc(docRef);
};

const getRecentItemIds = async (): Promise<string[]> => {
	const docRef = doc(db, `Users/${get(user).id}/Data/RecentItems`);
	console.log('getDoc recentItemIds');
	const docSnap = await getDoc(docRef);
	return docSnap.data()?.recentItemIds || [];
};

export const recentItems = asyncDerived(
	items,
	async ($items) => {
		console.log('#### recetn tiems');
		const recentItemIds = await getRecentItemIds();
		if (!recentItemIds.length) return [];
		const recentItems = $items.filter((i) => recentItemIds.includes(i.id));
		const sortedRecentItems = recentItems.sort(
			(a, b) => recentItemIds.indexOf(a.id) - recentItemIds.indexOf(b.id)
		);
		return sortedRecentItems;
	},
	true,
	[]
);

export async function setRecentItem(mostRecentItem: Item) {
	let recentItemIds = await getRecentItemIds();
	recentItemIds = recentItemIds.filter((item) => item !== mostRecentItem.id);
	recentItemIds.unshift(mostRecentItem.id);
	recentItemIds = recentItemIds.splice(0, 50);
	const docRef = doc(db, `Users/${get(user).id}/Data/RecentItems`);
	console.log('setDoc RecentItem', mostRecentItem.id);
	await setDoc(docRef, { recentItemIds });
	await recentItems.reload();
}

export async function saveExternalItem(item: Item) {
	const colRef = collection(db, `Users/${get(user).id}/Items`);
	const queryInstance = query(colRef, where('id', '==', item.id));
	console.log('getDocs saveExternalItem', item.id);
	const querySnap = await getDocs(queryInstance);
	if (querySnap.docs.length) return;

	if (!item.items) item.items = [];
	item.portions = item.portions ? item.portions.map((p) => ({ ...p, key: uuid() })) : [];
	item.createdAt = Date.now();
	item.updatedAt = Date.now();

	console.log('setDoc saveExternalItem', item.id);
	const docRef = doc(db, `Users/${get(user).id}/Items/` + item.id);
	await setDoc(docRef, item);
	await items.reload();
}

export function flattenItem(item: Item): Item {
	if (item.kcalPer100) return item;
	return {
		...item,
		kcalPer100: calculateKcalPer100FromItems(item.items, item.amount),
		items: [],
	};
}

export const defaultItem = {
	id: '',
	label: '',
	brand: '',
	kcalPer100: 100, // 0 means no override
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

export interface Item {
	id: string;
	brand?: string;
	label: string;
	kcalPer100: number;
	amount?: number;
	items?: ItemInstance[];
	portions?: Portion[];
	createdAt?: number;
	updatedAt?: number;
	ean?: number;
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
