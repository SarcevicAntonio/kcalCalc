<script>
	import Input from '$lib/Input.svelte';
	import IcAdd from '~icons/ic/round-add';
	import IcHouse from '~icons/mdi/house';

	let filterValue = '';
</script>

<h2 class="headline-1">Saved Items</h2>
<Input bind:value={filterValue}>Filter</Input>

<nav>
	<a href="/items/add"><IcAdd /> Add</a>
	<a href="/day/xxx">
		<IcHouse />
	</a>
</nav>
