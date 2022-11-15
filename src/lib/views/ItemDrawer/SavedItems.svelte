<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import { items, type Item } from '$lib/data/items';
	import { fuzzySearch } from '$lib/fuzzySearch';
	import Input from '$lib/Input.svelte';
	import { createEventDispatcher } from 'svelte';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcItems from '~icons/ic/round-category';
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt';
	import AddItem from './AddItem.svelte';
	import QuickSnacks from './QuickSnacks.svelte';

	const dispatch = createEventDispatcher<{ edit: Item }>();

	let search = '';
	let showQuickSnacks = false;
</script>

{#if !showQuickSnacks}
	<h2 class="headline-3 with-icon"><IcItems /> Items</h2>
	<Input clearable bind:value={search}>Search</Input>
	{#if $items}
		<ItemCards
			on:select={({ detail: selectedItem }) => dispatch('edit', selectedItem)}
			items={search
				? fuzzySearch($items, search)
				: $items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))}
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
