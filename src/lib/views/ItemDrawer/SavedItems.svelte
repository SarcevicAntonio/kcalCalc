<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte'
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte'
	import {
		getSortedItems,
		items,
		ItemSortModes,
		type Item,
	} from '$lib/data/items'
	import { fuzzySearch } from '$lib/fuzzySearch'
	import Input from '$lib/Input.svelte'
	import Select from '$lib/Select.svelte'
	import { createEventDispatcher } from 'svelte'
	import IcArrowBack from '~icons/ic/round-arrow-back'
	import IcItems from '~icons/ic/round-category'
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt'
	import AddItem from './AddItem.svelte'
	import QuickSnacks from './QuickSnacks.svelte'

	let search = ''
	let showQuickSnacks = false
	let sortMode = ItemSortModes.updatedAt
	const dispatch = createEventDispatcher<{ edit: Item }>()

	$: sortedItems = getSortedItems(sortMode)

	const sortModeOptions = Object.values(ItemSortModes).map((value) => ({
		label: value,
		value,
	}))
</script>

{#if !showQuickSnacks}
	<h2 class="headline-3 with-icon"><IcItems /> Saved Items</h2>
	<Input clearable bind:value={search}>Search</Input>

	{#if !search}
		<Select bind:value={sortMode} options={sortModeOptions}>Sort</Select>
	{/if}

	{#if sortedItems}
		<ItemCards
			on:select={({ detail: selectedItem }) => dispatch('edit', selectedItem)}
			items={search ? fuzzySearch($items, search) : sortedItems}
		>
			<IcItems /> No saved items found.
		</ItemCards>
	{:else}
		{#each { length: 10 } as _}
			<ItemSkeleton />
		{/each}
	{/if}
{:else}
	<QuickSnacks />
{/if}

<nav class="fab-bar sticky">
	{#if !showQuickSnacks}
		<button
			data-testid="quick-snacks"
			on:click={() => (showQuickSnacks = true)}
		>
			<MaterialSymbolsOfflineBolt />
		</button>
		<AddItem
			on:created={({ detail: newItem }) => dispatch('edit', newItem)}
			label={search}
		/>
	{:else}
		<button on:click={() => (showQuickSnacks = false)}>
			<IcArrowBack />
		</button>
	{/if}
</nav>

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
