<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from './Input.svelte';
	import { ingredientPresets, type Ingredient } from './stores/ingredients';

	const dispatch = createEventDispatcher<{ select: Ingredient }>();

	let value = '';

	$: filtered = $ingredientPresets.filter((v) =>
		v.label.toLowerCase().includes(value.toLowerCase())
	);
</script>

<div class="wrapper col gap">
	{#each filtered as item}
		<button
			class="card"
			on:click={() => {
				dispatch('select', item);
			}}
		>
			{item.label}
		</button>
	{/each}
</div>
<Input bind:value type="text">Suchen</Input>

<style>
	.wrapper {
		overflow-y: auto;
		max-height: 30em;
		min-width: 14em;
	}
	button {
		text-align: unset;
		border: unset;
	}
</style>
