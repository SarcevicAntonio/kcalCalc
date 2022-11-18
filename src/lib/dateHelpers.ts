import { formatISO } from 'date-fns'

export const toISODateString = (date: Date) => {
	return formatISO(date, { representation: 'date' })
}
