<script>
	import Home from '$lib/components/Home.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Input from '$lib/Input.svelte';
	import IcAdd from '~icons/ic/round-add';
	import Fuse from 'fuse.js';

	let search = '';

	export let data;
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={search}>Search</Input>

{#each search ? new Fuse(data, { keys: ['label', 'brand'] })
			.search(search + '')
			.map((res) => res.item) : data as item}
	<a sveltekit:prefetch href="/items/edit/{item.id}">
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
</style>
