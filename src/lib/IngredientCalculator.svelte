<script lang="ts">
	import { Dialog } from 'as-comps';
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { db } from './firebase';
	import Input from './Input.svelte';
	import { newIngredient, type Ingredient, type IngredientInstance } from './stores/ingredients';
	import IconPreset from '~icons/mdi/backup-restore';

	export let hideLabel = false;

	export let ingredient: IngredientInstance = newIngredient();

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
	{#if !hideLabel}
		<Input placeholder="Zwiebel" type="text" bind:value={ingredient.label}>Label</Input>
	{/if}

	<div class="row gap preset-btn">
		<Input bind:value={ingredient.kcalPer100}>kcal per 100x</Input>
		<Dialog let:toggle>
			<svelte:fragment slot="trigger-label">
				<IconPreset />
			</svelte:fragment>
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
	</div>

	<Input bind:value={ingredient.amount}>g / ml</Input>

	<div class="row sb">
		<slot><span /></slot>
		<span class="bold">
			{kcal.toFixed(0)} kcal
		</span>
	</div>
</div>

<style>
	span {
		align-self: flex-end;
	}
	.preset-btn {
		align-items: flex-end;
	}
</style>
