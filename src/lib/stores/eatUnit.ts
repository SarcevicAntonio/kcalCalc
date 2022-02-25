import { writable } from 'svelte-local-storage-store';
import type { IngredientInstance } from './ingredients';
import { v4 as uuidv4 } from 'uuid';

export interface EatUnit {
	id?: string;
	label: string;
	kcal: number;
	ingredientInstances?: IngredientInstance[];
	date: string;
}

function eatUnitStore() {
	const { subscribe, update } = writable<EatUnit[]>('eatUnit', []);

	return {
		subscribe,
		add: (unit: EatUnit) => {
			update((state) => [...state, { ...unit, id: uuidv4() }]);
		},
		remove: (id: string) => {
			update((state) => state.filter((a) => a.id !== id));
		}
	};
}

const eatUnits = eatUnitStore();

export default eatUnits;
