<script lang="ts">
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import { v4 as uuidv4 } from 'uuid';

	import Input from '$lib/Input.svelte';
	import type { EatUnit } from '$lib/stores/eatUnit';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let eatUnit: EatUnit = {
		label: null,
		date: new Date().toISOString().split('T')[0],
		kcal: 0,
		ingredients: []
	};

	function addIngredient() {
		const next = [
			...eatUnit.ingredients,
			{
				label: '',
				kcalPer100: 0,
				amount: 0,
				id: uuidv4()
			}
		];
		eatUnit.ingredients = next;
	}

	$: if (eatUnit.ingredients.length) {
		eatUnit.kcal = eatUnit.ingredients.reduce(
			(prev, next) => prev + (next.kcalPer100 / 100) * next.amount,
			0
		);
	}
</script>

<div class="row">
	<div class="col">
		<h1>Essenseinheit</h1>
		<span class="bold">{eatUnit.kcal} kcal</span>
	</div>
</div>

<Input type="date" bind:value={eatUnit.date}>Datum</Input>

<Input type="text" placeholder="Pizza" bind:value={eatUnit.label}>Label</Input>

<div class="row gap">
	<input
		id="trackIngredients"
		type="checkbox"
		checked={!!eatUnit.ingredients.length}
		on:change={() => {
			if (!eatUnit.ingredients.length) {
				addIngredient();
			} else {
				eatUnit.ingredients = [];
			}
		}}
	/>
	<label for="trackIngredients">Zutaten tracken</label>
</div>

{#if !eatUnit.ingredients.length}
	<Input type="number" bind:value={eatUnit.kcal}>kcal</Input>
{:else}
	{#each eatUnit.ingredients as ingredient (ingredient.id)}
		<IngredientCalculator bind:ingredient />
	{/each}
{/if}

<div class="fabs sb aic">
	{#if eatUnit.ingredients.length}
		<button on:click={addIngredient}>➕</button>
	{:else}
		<div />
	{/if}
	<button
		class="primary"
		on:click={() => {
			dispatch('save', eatUnit);
		}}
	>
		☁
	</button>
</div>
