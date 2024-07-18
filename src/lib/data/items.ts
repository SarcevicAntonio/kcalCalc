import { cleanString } from '$lib/cleanString'
import { db } from '$lib/firebase'
import { calculateKcalPer100FromItems } from '$lib/kcal'
import { getStorage, setStorage } from '$lib/localStorage'
import { asyncDerived, asyncWritable } from '@square/svelte-store'
import {
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	setDoc,
	where,
	type Unsubscribe,
} from 'firebase/firestore'
import { get } from 'svelte/store'
import { v4 as uuid } from 'uuid'
import { user } from './user'

const ITEMS_STORAGE_KEY = 'v1/items'

export const items = asyncWritable<typeof user, Item[]>(user, async ($user) => {
	if (unsubscribeItems) unsubscribeItems()
	const colRef = collection(db, `Users/${$user.id}/Items`)
	const data: Item[] = []
	subscribeItems(colRef)
	return getStorage(ITEMS_STORAGE_KEY, data) as Item[]
})

let unsubscribeItems: Unsubscribe

function subscribeItems(colRef: CollectionReference) {
	unsubscribeItems = onSnapshot(colRef, (querySnap) => {
		const data: Item[] = []
		querySnap.docs.forEach((doc) => {
			const docData = doc.data()
			data.push({ ...(docData as Item), id: doc.id })
		})
		setStorage(ITEMS_STORAGE_KEY, data)
		items.set(data)
	})
}

export const createItem = (id: string, label = ''): Item => {
	const colRef = doc(db, `Users/${get(user).id}/Items/` + id)
	console.log('setDoc newItem', id)
	const item: Item = {
		...defaultItem,
		id,
		label,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	}
	setDoc(colRef, item)
	return item
}

export const createItemStore = (item: Item) => {
	const id = item.id
	const store = asyncWritable<[], Item>(
		[],
		async () => {
			const docRef = doc(db, `Users/${get(user).id}/Items/${id}`)
			console.log('getDoc new ItemStore', id)
			const docSnap = await getDoc(docRef)
			return docSnap.data() as Item
		},
		async (data: Item) => {
			const docRef = doc(db, `Users/${get(user).id}/Items/${data.id}`)
			console.log('setDoc ItemStore', id)
			await setDoc(docRef, { ...data, updatedAt: Date.now() })
		},
		true,
		item
	)
	return store
}

export const deleteItem = (id: string) => {
	const docRef = doc(db, `Users/${get(user).id}/Items/${id}`)
	console.log('deleteDoc', id)
	return deleteDoc(docRef)
}

const getRecentItemIds = async (): Promise<string[]> => {
	const docRef = doc(db, `Users/${get(user).id}/Data/RecentItems`)
	console.log('getDoc recentItemIds')
	const docSnap = await getDoc(docRef)
	return docSnap.data()?.recentItemIds || []
}

export const recentItems = asyncDerived(
	items,
	async ($items) => {
		console.log('#### recetn tiems')
		const recentItemIds = await getRecentItemIds()
		if (!recentItemIds.length) return []
		const recentItems = $items.filter((i) => recentItemIds.includes(i.id))
		const sortedRecentItems = recentItems.sort(
			(a, b) => recentItemIds.indexOf(a.id) - recentItemIds.indexOf(b.id)
		)
		return sortedRecentItems
	},
	true,
	[]
)

export async function setRecentItem(mostRecentItem: Item) {
	let recentItemIds = await getRecentItemIds()
	recentItemIds = recentItemIds.filter((item) => item !== mostRecentItem.id)
	recentItemIds.unshift(mostRecentItem.id)
	recentItemIds = recentItemIds.splice(0, 50)
	const docRef = doc(db, `Users/${get(user).id}/Data/RecentItems`)
	console.log('setDoc RecentItem', mostRecentItem.id)
	await setDoc(docRef, { recentItemIds })
	await recentItems.reload()
}

export async function saveExternalItem(item: Item) {
	const colRef = collection(db, `Users/${get(user).id}/Items`)
	const queryInstance = query(colRef, where('id', '==', item.id))
	console.log('getDocs saveExternalItem', item.id)
	const querySnap = await getDocs(queryInstance)
	if (querySnap.docs.length) return querySnap.docs[0].data() as Item

	if (!item.items) item.items = []
	item.portions = item.portions
		? item.portions.map((p) => ({ ...p, key: uuid() }))
		: []
	item.createdAt = Date.now()
	item.updatedAt = Date.now()

	console.log('setDoc saveExternalItem', item.id)
	const docRef = doc(db, `Users/${get(user).id}/Items/` + item.id)
	await setDoc(docRef, item)
	return item
}

export function flattenItem(item: Item): Item {
	if (item.kcalPer100) return item
	return {
		...item,
		kcalPer100: calculateKcalPer100FromItems(item.items, item.amount),
		items: [],
	}
}

export const defaultItem = {
	id: '',
	label: '',
	brand: '',
	kcalPer100: 100, // 0 means no override
	proteinPer100: 100, // 0 means no override
	amount: 0, // 0 means no override
	items: [],
	portions: [],
}

export const defaultPortion = {
	key: '',
	label: '',
	amount: 0,
}

export const customItem = {
	id: 'CUSTOM:ITEM',
	label: '',
	kcalPer100: 100,
	proteinPer100:100,
	amount: 100,
}

export interface Item {
	id: string
	label: string
	brand?: string
	kcalPer100: number
	proteinPer100?: number
	amount?: number
	portions?: Portion[]
	items?: ItemInstance[]
	createdAt?: number
	updatedAt?: number
	ean?: number
}

export interface ItemInstance {
	key?: string
	id: string
	label: string
	brand?: string
	kcalPer100: number
	proteinPer100?: number
	amount: number
	portions?: Portion[]
}

export interface Portion {
	key?: string
	label: string
	amount: number
}

// export function fakeABunchOfItems() {
// 	const items = [];
// 	for (let index = 0; index < 1000; index++) {
// 		items.push({ ...defaultItem, label: uuid(), id: uuid() });
// 	}
// 	return items;
// }

export enum ItemSortModes {
	updatedAt = 'Recently Updated',
	createdAt = 'Creation Time',
	label = 'Label',
	brand = 'Brand',
	recentItems = 'Recent Items',
}

export function getSortedItems(mode: ItemSortModes) {
	const $items = get(items)
	const collator = new Intl.Collator()
	console.log('sorting by ...' + mode)
	switch (mode) {
		case ItemSortModes.updatedAt:
			return $items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
		case ItemSortModes.createdAt:
			return $items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
		case ItemSortModes.label:
			return $items.sort(({ label: a }, { label: b }) => {
				const cleanA = cleanString(a)
				const cleanB = cleanString(b)
				return collator.compare(cleanA, cleanB)
			})
		case ItemSortModes.brand:
			return $items.sort(({ brand: a }, { brand: b }) => {
				const cleanA = cleanString(a)
				const cleanB = cleanString(b)
				return collator.compare(cleanA, cleanB)
			})
		case ItemSortModes.recentItems:
			return get(recentItems)
		default:
			console.warn('No sort mode for ' + mode)
			return $items
	}
}
