import type { ItemInstance } from '$lib/stores/items';

export interface Day {
	// id: string;
	meals: Array<{ label: string; intake: ItemInstance[] }>;
}

export const day: Day = {
	meals: [
		{
			label: 'Breakfast',
			intake: [
				// Save "Reduced" version of Item
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
		},

		{
			label: 'Lunch',
			intake: [
				{
					id: 'CUSTOM:KCAL_COUNT',
					label: 'Schuss Milch',
					kcalPer100: 100, // no input- stays at 100 so amount functions as kcal input
					amount: 5,
				},
				{
					id: 'CUSTOM:KCAL+AMOUNT',
					label: 'Revolver Milch',
					kcalPer100: 420,
					amount: 70,
				},
				{
					id: '4312',
					label: 'Emmer-Dinkelbrot',
					brand: "Essmann's Backstube",
					kcalPer100: 312,
					amount: 20,
				},
			],
		},
		{ label: 'Dinner', intake: [] as ItemInstance[] },
		{ label: 'Snacks', intake: [] as ItemInstance[] },
	],
};
