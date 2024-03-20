import type { ItemInstance } from './data/items'
import { calculateAmountSum } from './kcal'

export const calculateProtein = (item: ItemInstance) =>
	(item.proteinPer100 / 100) * item.amount

export const calculateProteinFromItems = (items: ItemInstance[]) => {
	return items.reduce((acc, item) => acc + calculateProtein(item), 0)
}

export const calculateProteinPer100FromItems = (
	items: ItemInstance[],
	amountSum = 0
) => {
	if (!amountSum) amountSum = calculateAmountSum(items)
	const protein = calculateProteinFromItems(items)
	return (protein / amountSum) * 100
}
