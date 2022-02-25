<script>
	import { Dialog } from 'as-comps';
	import { onMount } from 'svelte';
	import Input from './Input.svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from './firebase';

	let kcalPer100 = 0;
	let grams = 0;

	export let kcal = 0;

	$: kcal = (kcalPer100 / 100) * grams;

	let ingredientSelectState = null;

	let presets = [];

	async function getFirestore() {
		const querySnapshot = await getDocs(collection(db, 'ingredients'));
		querySnapshot.forEach((doc) => {
			presets.push(doc.data());
			console.log(`${doc.id} => `, doc.data());
		});
		presets = presets;
	}

	onMount(() => {
		getFirestore();
	});
</script>

<div>
	<Dialog triggerLabel="✨" let:toggle>
		<label for="ingredient">Select Ingredient</label>
		<br />
		<select id="ingredient" bind:value={ingredientSelectState}>
			{#each presets as ingredient}
				<option value={ingredient.kcalPer100}>{ingredient.label}</option>
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
