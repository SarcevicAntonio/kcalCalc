import { db } from '$lib/firebase';
import { notification } from 'as-comps';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { get, writable, type Writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export function newIngredient() {
	return { label: '', kcalPer100: 100, amount: 100, instanceId: uuidv4() };
}

export interface Ingredient {
	docId?: string;
	label: string;
	kcalPer100: number;
}

export interface IngredientInstance extends Ingredient {
	amount: number;
	instanceId: string;
}

export const ingredientPresets: Writable<Ingredient[]> = writable([]);

async function getData() {
	const presets = [];
	const querySnapshot = await getDocs(collection(db, 'ingredients'));
	querySnapshot.forEach((doc) => {
		presets.push({ ...doc.data(), docId: doc.id } as Ingredient);
	});
	ingredientPresets.set(presets);
}

getData();

export function saveIngredients(ingredients: Ingredient[]) {
	if (!ingredients.length) return;

	const presets = get(ingredientPresets);
	let saveCount = 0;

	const requests = ingredients.map((ingredient) => {
		ingredient.label = ingredient.label.trim();
		if (ingredient.label && !presets.some((e) => e.label === ingredient.label)) {
			saveCount++;
			return addDoc(collection(db, 'ingredients'), {
				kcalPer100: ingredient.kcalPer100,
				label: ingredient.label
			});
		}
	});

	Promise.all(requests).then(() => {
		getData();
		if (saveCount) {
			notification(saveCount + ' Zutat' + (saveCount !== 1 ? 'en' : '') + ' gespeichert');
		}
	});
}

export async function deleteIngredient(item: Ingredient) {
	await deleteDoc(doc(db, 'ingredients', item.docId));
	getData();
	notification('Zutat "' + item.label + ' gelöscht');
}
