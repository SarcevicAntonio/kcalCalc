<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import animationOptions from '$lib/animationOptions';
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import eatUnits, { getEatUnit } from '$lib/stores/eatUnit';
	import { newIngredient, saveIngredients } from '$lib/stores/ingredients';
	import { Dialog } from 'as-comps';
	import { flip } from 'svelte/animate';
	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconSave from '~icons/mdi/cloud-upload';
	import IconDelete from '~icons/mdi/delete';
	import IconPlus from '~icons/mdi/plus-thick';

	let editMade = false;

	const { id } = $page.params;

	let eatUnit = getEatUnit(id);

	function addIngredient() {
		const next = [...eatUnit.ingredients, newIngredient()];
		eatUnit.ingredients = next;
		edited();
	}

	function removeIngredient(instanceId) {
		const next = eatUnit.ingredients.filter((a) => {
			return a.instanceId !== instanceId;
		});
		eatUnit.ingredients = next;
		edited();
	}

	$: if (eatUnit && eatUnit.ingredients.length) {
		eatUnit.kcal = eatUnit.ingredients.reduce(
			(prev, next) => prev + (next.kcalPer100 / 100) * next.amount,
			0
		);
	}

	function edited() {
		editMade = true;
	}
</script>

{#if eatUnit}
	<div class="row">
		<div class="col">
			<h1>Einheit</h1>
			<span class="bold">{eatUnit.kcal} kcal</span>
		</div>
	</div>

	<Input type="date" bind:value={eatUnit.date} on:change={edited}>Datum</Input>

	<Input type="text" placeholder="Pizza" bind:value={eatUnit.label} on:change={edited}>Label</Input>

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
					edited();
				}
			}}
		/>
		<label for="trackIngredients">Zutaten tracken</label>
	</div>

	{#if !eatUnit.ingredients.length}
		<Input type="number" bind:value={eatUnit.kcal} on:change={edited}>kcal</Input>
	{:else}
		{#each eatUnit.ingredients as ingredient (ingredient.instanceId)}
			<div animate:flip={animationOptions}>
				<IngredientCalculator bind:ingredient on:change={edited}>
					<button
						on:click={() => {
							removeIngredient(ingredient.instanceId);
						}}
					>
						<IconDelete />
					</button>
				</IngredientCalculator>
			</div>
		{/each}
	{/if}

	<nav class="sb aic">
		<button on:click={addIngredient}><IconPlus /> Zutat</button>
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
						eatUnits.remove(id);
						goto('/' + eatUnit.date.replaceAll('-', '/'));
						toggle();
					}}
				>
					<IconDelete /> Einheit Löschen
				</button>
			</svelte:fragment>
		</Dialog>

		{#if editMade}
			<button
				class="primary"
				on:click={() => {
					saveIngredients(eatUnit.ingredients);
					eatUnits.updateEntry(eatUnit);
					editMade = false;
				}}
			>
				<IconSave />
			</button>
		{:else}
			<a class="primary" href="/{eatUnit.date.replaceAll('-', '/')}">
				<IconArrowLeft />
			</a>
		{/if}
	</nav>
{/if}
