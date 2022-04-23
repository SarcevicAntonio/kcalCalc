<script>
	import ItemCard from '$lib/components/ItemCard.svelte';
	import Input from '$lib/Input.svelte';
	import { items } from '$lib/stores/items';
	import IcAdd from '~icons/ic/round-add';
	import IcHouse from '~icons/mdi/house';
	let filterValue = '';
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={filterValue}>Filter</Input>

{#each items as item}
	<a href="/items/edit/{item.id}">
		<ItemCard {item} />
	</a>
{/each}

<nav>
	<a href="/items/add"><IcAdd /> Add</a>
	<a href="/day/xxx">
		<IcHouse />
	</a>
</nav>

<style>
	a {
		text-decoration: none;
	}
</style>
