<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import { items } from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import Fuse from 'fuse.js';

	let search = '';
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={search}>Search</Input>

<ItemCards
	on:select
	items={search
		? new Fuse($items, { keys: ['label', 'brand'] }).search(search + '').map((res) => res.item)
		: $items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))}
/>

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
