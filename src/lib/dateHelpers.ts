import { formatISO } from 'date-fns';

export const toISODateString = (date) => {
	return formatISO(date, { representation: 'date' });
};
