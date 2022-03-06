<script lang="ts">
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';
	import IconPreset from '~icons/mdi/backup-restore';
	import animationOptions from './animationOptions';
	import IngredientPresets from './IngredientPresets.svelte';
	import Input from './Input.svelte';
	import { ingredientPresets, newIngredient, type IngredientInstance } from './stores/ingredients';

	const dispatch = createEventDispatcher();

	export let ingredient: IngredientInstance = newIngredient();

	$: kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;

	function handleSelect(e) {
		ingredient = { ...ingredient, ...e.detail };
		dispatch('change');
	}
</script>

<div class="card col gap" transition:scale|local={animationOptions}>
	<div class="row gap preset-btn">
		<Input
			placeholder="Zwiebel"
			type="text"
			bind:value={ingredient.label}
			options={$ingredientPresets}
			on:select={handleSelect}
			on:change>Label</Input
		>
		<Dialog let:toggle>
			<svelte:fragment slot="trigger-label">
				<IconPreset />
			</svelte:fragment>
			<IngredientPresets
				on:select={(e) => {
					handleSelect(e);
					toggle();
				}}
			/>
		</Dialog>
	</div>

	<div class="row gap preset-btn">
		<Input bind:value={ingredient.kcalPer100} on:change>kcal per 100x</Input>
		<Input bind:value={ingredient.amount} on:change>g|ml</Input>
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
