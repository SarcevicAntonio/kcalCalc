<script lang="ts">
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import type { EatUnit } from '$lib/stores/eatUnit';
	import { newIngredient } from '$lib/stores/ingredients';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ save: EatUnit }>();

	export let eatUnit: EatUnit;

	function addIngredient() {
		const next = [...eatUnit.ingredients, newIngredient()];
		eatUnit.ingredients = next;
	}

	function removeIngredient(id) {
		const next = eatUnit.ingredients.filter((a) => {
			return a.id !== id;
		});
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
		<h1>Einheit</h1>
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
		<IngredientCalculator bind:ingredient>
			<button
				on:click={() => {
					removeIngredient(ingredient.id);
				}}
			>
				❌
			</button></IngredientCalculator
		>
	{/each}
{/if}

<nav class="sb aic">
	{#if eatUnit.ingredients.length}
		<button on:click={addIngredient}>➕ Zutat</button>
	{:else}
		<span />
	{/if}
	<button
		class="primary"
		on:click={() => {
			dispatch('save', eatUnit);
		}}
	>
		☁ Speichern
	</button>
</nav>
