import { db } from '$lib/firebase'
import { getStorage, setStorage } from '$lib/localStorage'
import { asyncWritable } from '@square/svelte-store'
import {
	doc,
	DocumentReference,
	onSnapshot,
	setDoc,
	type Unsubscribe,
} from 'firebase/firestore'
import { writable } from 'svelte/store'

export const user = writable<User>()

const USER_SETTINGS_STORAGE_KEY = 'v1/userSettings'
let gotInitialData = false

export const userSettings = asyncWritable(
	[user],
	async ([$user]) => {
		if (unsubscribeUserSettings) unsubscribeUserSettings()
		const docRef = doc(db, `Users/${$user.id}/Data/Settings`)
		subscribeUserSettings(docRef)
		return getStorage(USER_SETTINGS_STORAGE_KEY, {}) as UserSettings
	},
	async (settings, [$user]) => {
		if (!gotInitialData) return
		console.log('setDoc userSettings')
		const docRef = doc(db, `Users/${$user.id}/Data/Settings`)
		await setDoc(docRef, settings)
	},
	true
)

let unsubscribeUserSettings: Unsubscribe

function subscribeUserSettings(docRef: DocumentReference) {
	unsubscribeUserSettings = onSnapshot(docRef, (docSnap) => {
		console.log('onSnapshot userSettings')
		const data = (docSnap.data() || {}) as UserSettings
		userSettings.set(data, false)
		setStorage(USER_SETTINGS_STORAGE_KEY, data)
		gotInitialData = true
	})
}

export interface User {
	id: string
	email: string
	displayName: string
	photoURL: string
}

export interface UserSettings {
	kcalLimit?: number
	proteinLimit?: number
}
