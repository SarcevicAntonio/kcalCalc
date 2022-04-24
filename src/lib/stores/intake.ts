import type { ItemInstance } from '$lib/stores/items';

export interface Meal {
	label: string;
	intake: ItemInstance[];
}

export interface Day {
	// id: string;
	meals: Meal[];
}

export const defaultDay: Day = {
	meals: [
		{ label: 'Breakfast', intake: [] },
		{ label: 'Lunch', intake: [] },
		{ label: 'Dinner', intake: [] },
		{ label: 'Snacks', intake: [] },
	],
};
