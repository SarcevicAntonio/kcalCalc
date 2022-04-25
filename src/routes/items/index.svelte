<script>
	import Home from '$lib/components/Home.svelte';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Input from '$lib/Input.svelte';
	import IcAdd from '~icons/ic/round-add';
	let filterValue = '';

	export let data;
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={filterValue}>Filter</Input>

{#each data as item}
	<a href="/items/edit/{item.id}">
		<ItemCard {item} />
	</a>
{/each}

<nav>
	<a href="/items/add"><IcAdd /> Add</a>
	<Home />
</nav>

<style>
	a {
		text-decoration: none;
	}
</style>
