import { db } from '$lib/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { get, writable, type Writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

export function newIngredient() {
	return { label: '', kcalPer100: 100, amount: 100, id: uuidv4() };
}

export interface Ingredient {
	label: string;
	kcalPer100: number;
}

export interface IngredientInstance extends Ingredient {
	amount: number;
	id: string;
}

export const ingredientPresets: Writable<Ingredient[]> = writable([]);

async function getData() {
	const presets = [];
	const querySnapshot = await getDocs(collection(db, 'ingredients'));
	querySnapshot.forEach((doc) => {
		presets.push(doc.data() as Ingredient);
	});
	ingredientPresets.set(presets);
}

getData();

export function saveIngredients(ingredients: Ingredient[]) {
	if (!ingredients.length) return;

	const presets = get(ingredientPresets);

	const requests = ingredients.map((ingredient) => {
		if (!presets.some((e) => e.label === ingredient.label)) {
			return addDoc(collection(db, 'ingredients'), {
				kcalPer100: ingredient.kcalPer100,
				label: ingredient.label
			});
		}
	});

	Promise.all(requests).then(() => {
		getData();
	});
}
