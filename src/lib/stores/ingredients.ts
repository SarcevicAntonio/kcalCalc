import { writable, type Writable } from 'svelte/store';

interface Ingredient {
	name: string;
	kcalPer100: number;
	ml?: boolean;
}

export interface IngredientInstance extends Ingredient {
	amount: number;
}

export const ingredients: Writable<Ingredient[]> = writable([
	{
		name: 'Emmer Dinkel',
		kcalPer100: 283
	},
	{
		name: 'Lätta Extra Fit',
		kcalPer100: 265
	},
	{
		name: 'Finesse Hühnerbrust',
		kcalPer100: 105
	},
	{
		name: 'Leerdammer Caractere',
		kcalPer100: 368
	},
	{
		name: 'Avocado',
		kcalPer100: 160
	},
	{
		name: 'Sirracha',
		kcalPer100: 139
	},
	{
		name: 'Parmesan',
		kcalPer100: 431
	},
	{
		name: 'Oatly Gartenkräuter',
		kcalPer100: 215
	}
]);
