import { writable, type Writable } from 'svelte/store';
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

export const ingredients: Writable<Ingredient[]> = writable([
	{
		label: 'Emmer Dinkel',
		kcalPer100: 283
	},
	{
		label: 'Lätta Extra Fit',
		kcalPer100: 265
	},
	{
		label: 'Finesse Hühnerbrust',
		kcalPer100: 105
	},
	{
		label: 'Leerdammer Caractere',
		kcalPer100: 368
	},
	{
		label: 'Avocado',
		kcalPer100: 160
	},
	{
		label: 'Sirracha',
		kcalPer100: 139
	},
	{
		label: 'Parmesan',
		kcalPer100: 431
	},
	{
		label: 'Oatly Gartenkräuter',
		kcalPer100: 215
	}
]);
