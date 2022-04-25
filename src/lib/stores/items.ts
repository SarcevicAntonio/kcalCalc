export interface Item {
	id: string;
	label: string;
	brand?: string;
	kcalPer100: number;
	amount: number;
	items: ItemInstance[];
	portions: Portion[];
}

export interface ItemInstance {
	key?: string;
	id: string;
	label: string;
	brand?: string;
	kcalPer100: number;
	amount: number;
}

export interface Portion {
	label: 'Scheibe';
	amount: 40;
}

export const getItem = (id: string) => items.find((item) => item.id === id);

export const defaultItem = {
	id: '',
	label: '',
	brand: '',
	kcalPer100: 0, // 0 means no override
	amount: 0, // 0 means no override
	items: [],
	portions: [],
};

export const defaultPortion = {
	label: '',
	amount: 0,
};

export const items: Item[] = [
	{
		id: '1',
		label: 'Brot town',
		brand: 'asdf laden',
		kcalPer100: 0, // 0 means no override
		amount: 0, // 0 means no override
		items: [
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
		portions: [
			{
				label: 'Scheibe',
				amount: 40,
			},
		],
	},
	{
		id: '2',
		label: 'Brot Laden',
		brand: 'asdf town',
		kcalPer100: 300, // 0 means no override
		amount: 0, // 0 means no override
		items: [],
		portions: [],
	},
];
