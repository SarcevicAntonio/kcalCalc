<script lang="ts">
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import type { EatUnit } from '$lib/stores/eatUnit';
	import { newIngredient, saveIngredients } from '$lib/stores/ingredients';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IconSave from '~icons/mdi/cloud-upload';
	import IconDelete from '~icons/mdi/delete';
	import IconPlus from '~icons/mdi/plus-thick';

	const dispatch = createEventDispatcher<{ save: EatUnit; delete: EatUnit }>();

	export let showDelete = false;
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
				<IconDelete />
			</button></IngredientCalculator
		>
	{/each}
{/if}

<nav class="sb aic">
	<button on:click={addIngredient}><IconPlus /> Zutat</button>

	{#if showDelete}
		<Dialog let:toggle>
			<svelte:fragment slot="trigger-label">
				<IconDelete />
			</svelte:fragment>
			<h1>Einheit Löschen</h1>
			<p>Sicher, dass du diese Einheit löschen willst?</p>
			<p>Die ist dann halt für immer weg, ne?</p>
			<svelte:fragment slot="dialog-actions">
				<button
					on:click={() => {
						toggle();
					}}>Doch nicht...</button
				>
				<button
					on:click={() => {
						dispatch('delete', eatUnit);
						toggle();
					}}
				>
					<IconDelete /> Einheit Löschen
				</button>
			</svelte:fragment>
		</Dialog>
	{/if}
	<button
		class="primary"
		on:click={() => {
			saveIngredients(eatUnit.ingredients);
			dispatch('save', eatUnit);
		}}
	>
		<IconSave /> Speichern
	</button>
</nav>
