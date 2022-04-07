<script lang="ts">
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';
	import IconCloud from '~icons/mdi/file-cloud';
	import IconPreset from '~icons/mdi/settings';
	import animationOptions from './animationOptions';
	import IngredientPresets from './IngredientPresets.svelte';
	import Input from './Input.svelte';
	import {
		ingredientPresets,
		newIngredient,
		type Ingredient,
		type IngredientInstance,
	} from './stores/ingredients';

	const dispatch = createEventDispatcher();

	export let ingredient: IngredientInstance = newIngredient();

	$: kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;

	function handleSelect(e: CustomEvent<Ingredient>) {
		ingredient.docId = '';
		ingredient.portions = [];
		ingredient = { ...ingredient, ...e.detail };
	}

	let fddbEntries = [];

	function onLabelInput() {
		if (ingredient.label.length >= 4) {
			loadFddbEntries();
		}
		ingredient.docId = '';
		ingredient.portions = [];
		dispatch('input');
	}

	async function loadFddbEntries() {
		await fetch('/search/' + encodeURIComponent(ingredient.label))
			.then((res) => res.json())
			.then((res) => {
				fddbEntries = res;
			});
	}
</script>

<div class="card col gap" transition:scale|local={animationOptions}>
	<div class="row gap preset-btn">
		<Input
			placeholder="Zwiebel"
			type="text"
			bind:value={ingredient.label}
			options={[...fddbEntries, ...$ingredientPresets]}
			on:select={handleSelect}
			on:input={onLabelInput}
		>
			Label
			<span class="end" slot="option-button-extra" let:option>
				{#if option['docId'].startsWith('FDDB_')}
					<IconCloud />
				{/if}
			</span>
		</Input>
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
		<Input bind:value={ingredient.kcalPer100} on:input>kcal per 100x</Input>
		<Input bind:value={ingredient.amount} on:input>g|ml</Input>
		{#if ingredient.portions?.length}
			<Dialog let:toggle>
				<svelte:fragment slot="trigger-label">
					<IconPreset />
				</svelte:fragment>
				<h2>Portionierungen</h2>
				<div class=" col gap">
					{#each ingredient.portions as portion}
						<button
							on:click={() => {
								ingredient.amount = portion.amount;
								dispatch('input');
								toggle();
							}}
						>
							{portion.label}: {portion.amount} g|ml
						</button>
					{/each}
				</div>
			</Dialog>
		{/if}
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
	.end {
		margin-left: auto;
		line-height: 1;
		align-self: center;
	}
</style>
