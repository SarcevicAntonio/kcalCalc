<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import { items } from '$lib/data/items';
	import { fuzzySearch } from '$lib/fuzzySearch';
	import Input from '$lib/Input.svelte';
	import IcItems from '~icons/ic/round-category';

	let search = '';
</script>

<h2 class="headline-3 with-icon"><IcItems /> Items</h2>
<Input clearable bind:value={search}>Search</Input>

{#if $items}
	<ItemCards
		on:select
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

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
