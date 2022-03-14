<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import animationOptions from '$lib/animationOptions';
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import eatUnits, { getEatUnit } from '$lib/stores/eatUnit';
	import { newIngredient, saveIngredients } from '$lib/stores/ingredients';
	import { Dialog } from 'as-comps';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconPortion from '~icons/mdi/circle-slice-5';
	import IconSave from '~icons/mdi/cloud-upload';
	import IconDelete from '~icons/mdi/delete';
	import IconPlus from '~icons/mdi/plus-thick';

	let editMade = false;

	const { id } = $page.params;

	let eatUnit = getEatUnit(id);

	async function addIngredient() {
		const next = [...eatUnit.ingredients, newIngredient()];
		eatUnit.ingredients = next;
		edited();
		await tick();
		window.scrollTo(0, document.body.scrollHeight);
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

	$: amountSum = eatUnit?.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
	$: kcalPer100 = (eatUnit?.kcal / amountSum) * 100;

	let divisor = 2;

	function edited() {
		editMade = true;
	}
</script>

{#if eatUnit}
	<div class="row sb">
		<div class="col">
			<h1>Einheit</h1>
			<span class="bold">
				{eatUnit.kcal.toFixed(0)} kcal
			</span>
		</div>
		<div class="col end">
			<span>
				{kcalPer100.toFixed(0)} kcal per 100x
			</span>
			<span>
				{amountSum.toFixed(0)} g|ml
			</span>
		</div>
	</div>

	<Input type="date" bind:value={eatUnit.date} on:input={edited}>Datum</Input>

	<Input type="text" placeholder="Pizza" bind:value={eatUnit.label} on:input={edited}>Label</Input>

	<div class="row gap">
		<input
			id="trackIngredients"
			type="checkbox"
			checked={!!eatUnit.ingredients.length}
			on:input={() => {
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
		<Input type="number" bind:value={eatUnit.kcal} on:input={edited}>kcal</Input>
	{:else}
		{#each eatUnit.ingredients as ingredient (ingredient.instanceId)}
			<div animate:flip={animationOptions}>
				<IngredientCalculator bind:ingredient on:input={edited}>
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
				<IconPortion />
			</svelte:fragment>
			<div class="col gap">
				<h2>Portionieren</h2>
				<Input type="number" bind:value={divisor} min="1">Portionen</Input>
				<br />
				<span>
					{eatUnit.kcal.toFixed(0)} kcal / {divisor.toFixed(0)} Portionen =
					<br />
					<span class="bold">{(eatUnit.kcal / divisor).toFixed(0)} kcal</span>
				</span>
				<br />
				{#if !eatUnit.ingredients.length}
					<span>
						Möchtest du die kcal in dieser Einheit durch die Anzahl der Portionen teilen?
					</span>
					<button
						on:click={() => {
							eatUnit.kcal = eatUnit.kcal / divisor;
							edited();
							toggle();
						}}
					>
						<IconPortion />
						kcal teilen
					</button>
				{:else}
					<span>
						Möchtest du die Zutaten in dieser Einheit durch die Anzahl der Portionen teilen?
					</span>
					<button
						on:click={() => {
							eatUnit.ingredients.forEach((e) => {
								e.amount = e.amount / divisor;
							});
							eatUnit = eatUnit;
							edited();
							toggle();
						}}
					>
						<IconPortion />
						Zutaten teilen
					</button>
				{/if}
			</div>
		</Dialog>

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
					}}
				>
					Doch nicht
				</button>
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

<style>
	.end {
		align-items: end;
		justify-content: end;
	}
</style>
