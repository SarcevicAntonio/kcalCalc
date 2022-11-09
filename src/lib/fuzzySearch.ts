import Fuse from 'fuse.js';
import type { Item } from './data/items';

export const fuseItemSettings = {
	keys: ['label', 'brand', 'ean'],
	ignoreLocation: true,
};

export const fuzzySearch = (items: Item[], search: string) =>
	new Fuse(items, fuseItemSettings).search(search + '').map((res) => res.item);
