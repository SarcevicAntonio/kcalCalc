<script lang="ts">
	import { Dialog } from 'as-comps';
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { db } from './firebase';
	import Input from './Input.svelte';
	import type { Ingredient, IngredientInstance } from './stores/ingredients';

	const mlId = uuidv4();

	export let ingredient: IngredientInstance = {
		id: uuidv4(),
		label: '',
		kcalPer100: 0,
		amount: 0
	};

	$: kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;

	let ingredientSelectState = null;

	let presets: Ingredient[] = [];

	async function getFirestore() {
		const querySnapshot = await getDocs(collection(db, 'ingredients'));
		querySnapshot.forEach((doc) => {
			presets.push(doc.data() as Ingredient);
		});
		presets = presets;
	}

	onMount(() => {
		getFirestore();
	});
</script>

<div class="card col gap">
	<Dialog triggerLabel="✨ Preset" let:toggle>
		<div class="col gap">
			<label for="preset">Select Ingredient</label>
			<select id="preset" bind:value={ingredientSelectState}>
				{#each presets as ingredientPreset}
					<option value={ingredientPreset.label}>{ingredientPreset.label}</option>
				{/each}
			</select>
			<button
				on:click={() => {
					ingredient = {
						...ingredient,
						...presets.find((a) => a.label === ingredientSelectState)
					};
					toggle();
				}}
			>
				Set ingredient
			</button>
		</div>
	</Dialog>

	<Input type="text" bind:value={ingredient.label}>Label</Input>

	<Input bind:value={ingredient.kcalPer100}>kcal per 100g</Input>

	<div class="row gap">
		<input id={mlId} type="checkbox" bind:checked={ingredient.ml} />
		<label for={mlId}>ml</label>
	</div>

	<Input bind:value={ingredient.amount}>
		{#if ingredient.ml}
			ml
		{:else}
			g
		{/if}
	</Input>

	<span class="bold">
		{kcal.toFixed(2)} kcal
	</span>

	<slot />
</div>

<style>
	span {
		align-self: flex-end;
	}
</style>
