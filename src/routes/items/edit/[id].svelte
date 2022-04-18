<script lang="ts">
	import { page } from '$app/stores';
	import Item from '$lib/components/Item.svelte';
	import Input from '$lib/Input.svelte';
	const id = parseInt($page.params.id);
	import MdiArrowLeft from '~icons/mdi/arrow-left';
	import MdiDeleteForever from '~icons/mdi/delete-forever';
	const item = {
		id: 4312,
		label: 'Brot town',
		brand: '',
		items: [
			{
				id: 1234,
				label: 'Leerdammer, Original',
				brand: 'Bel',
				kcalPer100: 283,
				amount: 20,
			},
			{
				id: 4312,
				label: 'Emmer-Dinkelbrot',
				brand: "Essmann's Backstube",
				kcalPer100: 312,
				amount: 20,
			},
		],
	};
</script>

<h2 class="headline-1">Edit Item</h2>

id: {id}

<Input bind:value={item.label}>Label</Input>
<Input bind:value={item.brand}>Brand</Input>

{#each item.items as child}
	<Item bind:item={child} />
{/each}

<div class="row center">
	<button class="btn tonal">+ add</button>
</div>
<h3>Portions</h3>

<div class="card outlined col gap">
	<Input value="Scheibe">Label</Input>
	<Input value="40">Amount in g || ml</Input>
</div>

<div class="row center">
	<button class="btn tonal">+ add</button>
</div>

<nav>
	<button>
		<MdiDeleteForever />
	</button>
	<a href="/items"><MdiArrowLeft /> Save</a>
</nav>
