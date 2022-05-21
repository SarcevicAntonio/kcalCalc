<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import { items } from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import Fuse from 'fuse.js';
	import IcItems from '~icons/ic/round-category';

	let search = '';
</script>

<h2 class="headline-3 with-icon"><IcItems /> Items</h2>
<Input clearable bind:value={search}>Search</Input>

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
