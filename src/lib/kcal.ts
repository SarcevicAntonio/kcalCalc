import type { ItemInstance } from './stores/items';

export const calculateKcal = (item: ItemInstance) => (item.kcalPer100 / 100) * item.amount;

export const calculateAmountSum = (items: ItemInstance[]) =>
	items.reduce((acc, ingredient) => acc + ingredient.amount, 0);

export const calculateKcalFromItems = (items: ItemInstance[]) => {
	return items.reduce((acc, item) => acc + calculateKcal(item), 0);
};

export const calculateKcalPer100FromItems = (items: ItemInstance[], amountSum = 0) => {
	if (!amountSum) amountSum = calculateAmountSum(items);
	const kcal = calculateKcalFromItems(items);
	return (kcal / amountSum) * 100;
};


export const kcalDisplay = (val: number | string) => {
	if (Number.isNaN(val) || typeof val !== 'number') {
		return '...';
	}

	return Math.round(val);
};
