import { db } from '$lib/firebase';
import { asyncDerived, asyncReadable, asyncWritable } from '@square/svelte-store';
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
		console.count('getDocs items');
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

export const createItem = (id: string) => {
	console.log('setDoc newItem', id);
	return setDoc(doc(db, 'Items/' + id), {
		...defaultItem,
		id,
		owner: get(user).id,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	});
};

export const createItemStore = (id: string) => {
	const store = asyncWritable(
		[],
		async () => {
			console.log('getDoc new ItemStore', id);
			return (await getDoc(doc(db, `Items/${id}`))).data() as Item;
		},
		async (data: Item) => {
			console.log('setDoc ItemStore', id);
			await setDoc(doc(db, `Items/${data.id}`), { ...data, updatedAt: Date.now() });
		}
	);
	return store;
};

export const deleteItem = (id: string) => {
	console.log('deleteDoc', id);
	return deleteDoc(doc(db, `Items/${id}`));
};

export const recentItems = asyncDerived(
	user,
	async ($user) => {
		console.log('getDoc recentItems');
		const snapshot = await getDoc(doc(db, `Users/${$user.id}/Data/RecentItems`));
		const data = snapshot.data()?.recentItems || [];
		return data as Item[];
	},
	true
);

export async function setRecentItem(mostRecentItem: Item) {
	let newRecentItems = get(recentItems).filter((item) => item.id !== mostRecentItem.id);
	newRecentItems.unshift(mostRecentItem);
	newRecentItems = newRecentItems.splice(0, 24);
	console.log('setDoc RecentItem', mostRecentItem.id);
	await setDoc(doc(db, `Users/${get(user).id}/Data/RecentItems`), { recentItems: newRecentItems });
	await recentItems.reload();
}

export async function saveExternalItem(item: Item) {
	console.log('getDocs saveExternalItem', item.id);
	if ((await getDocs(query(collection(db, `Items`), where('id', '==', item.id)))).docs.length) {
		return;
	}
	item.items = [];
	item.portions = item.portions ? item.portions.map((p) => ({ ...p, key: uuid() })) : [];
	console.log('setDoc saveExternalItem', item.id);
	await setDoc(doc(db, 'Items/' + item.id), item);
	items.reload();
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
