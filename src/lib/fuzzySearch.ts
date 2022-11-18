import { byLengthAsc, byStartAsc, extendedMatch, Fzf } from 'fzf'
import type { Item } from './data/items'

export const fuzzySearch = (items: Item[], search: string) =>
	new Fzf(items, {
		selector: ({ label, id, ean }) => `${label} (${id}) #${ean}`,
		tiebreakers: [byLengthAsc, byStartAsc],
		limit: 50,
		casing: 'case-insensitive',
		match: extendedMatch,
	})
		.find(search)
		.map(res => res.item)
