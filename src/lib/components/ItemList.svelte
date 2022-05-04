<script lang="ts">
	import ItemCard from '$lib/components/ItemCard.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Input from '$lib/Input.svelte';
	import { createItem, items } from '$lib/stores/items';
	import { user } from '$lib/stores/user';
	import Fuse from 'fuse.js';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcAdd from '~icons/ic/round-add';
	const dispatch = createEventDispatcher();

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
		<button
			disabled={!owner}
			on:click={() => {
				dispatch('selected', item.id);
			}}
		>
			<ItemCard {item} />
		</button>
	{/each}
{/await}

<nav class="fab-bar">
	<button
		on:click={async () => {
			const id = uuid();
			await createItem(id);
			dispatch('selected', id);
		}}
	>
		<IcAdd /> Add
	</button>
</nav>

<style>
	.fab-bar {
		position: sticky;
		padding: 0;
	}
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
