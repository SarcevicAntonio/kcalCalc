<script lang="ts">
	import Home from '$lib/components/Home.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Input from '$lib/Input.svelte';
	import { items } from '$lib/stores/items';
	import { user } from '$lib/stores/user';
	import Fuse from 'fuse.js';
	import IcAdd from '~icons/ic/round-add';

	let search = '';
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={search}>Search</Input>

{#await items.load()}
	{#each { length: 10 } as _}
		<ItemSkeleton />
	{/each}
{:then}
	{#each search ? new Fuse($items, { keys: ['label', 'brand'] })
				.search(search + '')
				.map((res) => res.item) : $items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)) as item (item.id)}
		{@const owner = item.owner ? $user.id === item.owner : true}
		<a sveltekit:prefetch href={owner ? `/items/edit/${item.id}` : ''} class:disabled={!owner}>
			<ItemCard {item} />
		</a>
	{/each}
{/await}

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
