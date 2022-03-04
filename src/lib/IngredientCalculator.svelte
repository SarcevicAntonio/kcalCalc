<script lang="ts">
	import { Dialog } from 'as-comps';
	import IconPreset from '~icons/mdi/backup-restore';
	import IngredientPresets from './IngredientPresets.svelte';
	import Input from './Input.svelte';
	import { ingredientPresets, newIngredient, type IngredientInstance } from './stores/ingredients';
	import { scale } from 'svelte/transition';
	export let ingredient: IngredientInstance = newIngredient();

	$: kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;

	let ingredientSelectState = null;
</script>

<div class="card col gap" transition:scale|local={{duration: 400}}>
	<div class="row gap preset-btn">
		<Input placeholder="Zwiebel" type="text" bind:value={ingredient.label}>Label</Input>
		<Dialog let:toggle>
			<svelte:fragment slot="trigger-label">
				<IconPreset />
			</svelte:fragment>
			<IngredientPresets
				on:select={(e) => {
					ingredient = { ...ingredient, ...e.detail };
					toggle();
				}}
			/>
		</Dialog>
	</div>

	<div class="row gap preset-btn">
		<Input bind:value={ingredient.kcalPer100}>kcal per 100x</Input>
		<Input bind:value={ingredient.amount}>g / ml</Input>
	</div>
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
