export const calculateKcal = (item) => (item.kcalPer100 / 100) * item.amount;

// TODO: check out the custom kcal input etc
export const calculateAmountSum = (items) =>
	items.reduce((acc, ingredient) => acc + ingredient.amount, 0);

export const calculateKcalFromItems = (items) =>
	items.reduce((acc, item) => acc + calculateKcal(item), 0);

export const calculateKcalPer100FromItems = (items, amountSum = 0) => {
	if (!amountSum) amountSum = calculateAmountSum(items);
	const kcal = calculateKcalFromItems(items);
	return (kcal / amountSum) * 100;
};
