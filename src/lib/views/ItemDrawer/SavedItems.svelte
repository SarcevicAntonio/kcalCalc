<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import { items, type Item } from '$lib/data/items';
	import { fuzzySearch } from '$lib/fuzzySearch';
	import Input from '$lib/Input.svelte';
	import Select from '$lib/Select.svelte';
	import { createEventDispatcher } from 'svelte';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcItems from '~icons/ic/round-category';
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt';
	import AddItem from './AddItem.svelte';
	import QuickSnacks from './QuickSnacks.svelte';

	let search = '';
	let showQuickSnacks = false;
	let sortMode = 'updatedAt';
	const dispatch = createEventDispatcher<{ edit: Item }>();
	const collator = new Intl.Collator();

	$: sortedItems = sortItems($items, sortMode);

	function sortItems(items: Item[], mode: string) {
		switch (mode) {
			case 'updatedAt':
				return items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
			case 'label':
				return items.sort(({ label: a }, { label: b }) => {
					const cleanA = cleanString(a);
					const cleanB = cleanString(b);
					return collator.compare(cleanA, cleanB);
				});
			default:
				return items;
		}
	}

	function cleanString(str: string) {
		// remove emojis and whitespace
		return str
			.replace(
				/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2580-\u27BF]|\uD83E[\uDD10-\uDDFF]| /g,
				''
			)
			.trim();
	}
</script>

{#if !showQuickSnacks}
	<h2 class="headline-3 with-icon"><IcItems /> Saved Items</h2>
	<Input clearable bind:value={search}>Search</Input>

	<Select
		bind:value={sortMode}
		options={[
			{
				label: 'Recently Updated',
				value: 'updatedAt',
			},
			{
				label: 'Label',
				value: 'label',
			},
		]}>Sort</Select
	>

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
		<button data-testid="quick-snacks" on:click={() => (showQuickSnacks = true)}>
			<MaterialSymbolsOfflineBolt />
		</button>
		<AddItem on:created={({ detail: newItem }) => dispatch('edit', newItem)} label={search} />
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
