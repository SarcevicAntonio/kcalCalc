import type { Item, ItemInstance } from '$lib/data/items';
import { calculateKcalPer100FromItems } from '$lib/kcal';
import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

export const instanceCreatorState = writable(null);

export function createInstance(item: Item): Promise<ItemInstance> {
	console.trace('test');
	const instance = {
		key: uuid(),
		id: item.id,
		label: item.label,
		brand: item.brand || '',
		kcalPer100: item.kcalPer100 || calculateKcalPer100FromItems(item.items, item.amount),
		amount: 100,
		portions: item.portions || [],
	};

	return new Promise((resolve, reject) => {
		instanceCreatorState.set({ item, instance, resolve, reject });
	});
}
