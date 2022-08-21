<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import { items } from '$lib/data/items';
	import { fuseItemSettings } from '$lib/fuse';
	import Input from '$lib/Input.svelte';
	import Fuse from 'fuse.js';
	import IcItems from '~icons/ic/round-category';

	let search = '';
</script>

<h2 class="headline-3 with-icon"><IcItems /> Items</h2>
<Input clearable bind:value={search}>Search</Input>

{#if $items}
	<ItemCards
		on:select
		items={search
			? new Fuse($items, fuseItemSettings).search(search + '').map((res) => res.item)
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
