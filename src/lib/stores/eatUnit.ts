import { writable } from 'svelte-local-storage-store';
import type { IngredientInstance } from './ingredients';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'svelte/store';

export interface EatUnit {
	id?: string;
	label: string;
	kcal: number;
	ingredients?: IngredientInstance[];
	date: string;
}

function eatUnitStore() {
	const { subscribe, update } = writable<EatUnit[]>('eatUnit', []);

	return {
		subscribe,
		add: (unit: EatUnit) => {
			const id = uuidv4();
			update((state) => [...state, { ...unit, id }]);
			return id;
		},
		remove: (id: string) => {
			update((state) => state.filter((a) => a.id !== id));
		},
		updateEntry: (unit: EatUnit) => {
			update((state) => {
				const index = state.findIndex((a) => a.id === unit.id);
				state[index] = unit;
				return state;
			});
		},
	};
}

const eatUnits = eatUnitStore();

export default eatUnits;

export function getEatUnit(id: string): EatUnit {
	return get(eatUnits).find((a) => a.id === id);
}
