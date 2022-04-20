export const getItem = (id) => items.find((item) => item.id === id);
export const items = [
	{
		id: 1,
		label: 'Brot town',
		brand: 'asdf laden',
		items: [
			{
				id: 1234,
				label: 'Leerdammer, Original',
				brand: 'Bel',
				kcalPer100: 283,
				amount: 20,
			},
			{
				id: 4312,
				label: 'Emmer-Dinkelbrot',
				brand: "Essmann's Backstube",
				kcalPer100: 312,
				amount: 20,
			},
		],
		overrideAmount: 0, // 0 means no override
		portions: [
			{
				label: 'Scheibe',
				amount: 40,
			},
		],
	},
];
