<script lang="ts">
	import Home from '$lib/components/Home.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Input from '$lib/Input.svelte';
	import IcAdd from '~icons/ic/round-add';
	import Fuse from 'fuse.js';
	import { user } from '$lib/stores/user';
	import type { Item } from '$lib/stores/items';

	let search = '';

	export let data: Item[];
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={search}>Search</Input>

{#each search ? new Fuse(data, { keys: ['label', 'brand'] })
			.search(search + '')
			.map((res) => res.item) : data.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)) as item}
	{@const owner = item.owner ? $user.id === item.owner : true}
	<a sveltekit:prefetch href={owner ? `/items/edit/${item.id}` : ''} class:disabled={!owner}>
		<ItemCard {item} />
	</a>
{/each}

<nav>
	<a sveltekit:prefetch href="/items/add"><IcAdd /> Add</a>
	<Home />
</nav>

<style>
	a {
		text-decoration: none;
	}
	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
