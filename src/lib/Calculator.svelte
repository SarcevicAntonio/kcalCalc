<script>
	import { Dialog } from 'as-comps';
	import Input from './Input.svelte';
	import { ingredients } from './stores/ingredients';

	let kcalPer100 = 0;
	let grams = 0;

	export let kcal = 0;

	$: kcal = (kcalPer100 / 100) * grams;

	let ingredientSelectState = null;
</script>

<div>
	<Dialog triggerLabel="✨" let:toggle>
		<label for="ingredient">Select Ingredient</label>
		<br />
		<select id="ingredient" bind:value={ingredientSelectState}>
			{#each $ingredients as ingredient}
				<option value={ingredient.kcalPer100}>{ingredient.name}</option>
			{/each}
		</select>
		<br />
		<button
			on:click={() => {
				kcalPer100 = ingredientSelectState;
				toggle();
			}}>Set ingredient</button
		>
	</Dialog>
	<Input bind:value={kcalPer100}>kcal per 100g</Input>

	<Input bind:value={grams}>grams</Input>

	<span>
		{kcal.toFixed(2)} kcal
	</span>

	<slot />
</div>

<style>
	div {
		display: flex;
		align-items: flex-end;
		gap: 1em;
	}
</style>
