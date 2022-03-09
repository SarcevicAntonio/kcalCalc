<script lang="ts">
	import { goto } from '$app/navigation';
	import animationOptions from '$lib/animationOptions';
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import eatUnits from '$lib/stores/eatUnit';
	import { newIngredient, saveIngredients } from '$lib/stores/ingredients';
	import { Dialog } from 'as-comps';
	import { flip } from 'svelte/animate';
	import IconPortion from '~icons/mdi/circle-slice-5';
	import IconSave from '~icons/mdi/cloud-upload';
	import IconDelete from '~icons/mdi/delete';
	import IconHome from '~icons/mdi/home';
	import IconPlus from '~icons/mdi/plus-thick';

	let ingredients = [newIngredient()];

	function addIngredient() {
		ingredients = [...ingredients, newIngredient()];
	}

	function removeIngredient(instanceId) {
		ingredients = ingredients.filter((a) => {
			return a.instanceId !== instanceId;
		});
	}

	$: kcalSum = ingredients.reduce((acc, ingredient) => {
		let kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;
		return acc + kcal;
	}, 0);

	$: amountSum = ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
	$: kcalPer100 = (kcalSum / amountSum) * 100;

	let divisor = 2;

	function saveAsUnit() {
		let eatUnit = {
			label: null,
			date: new Date().toISOString().split('T')[0],
			kcal: kcalSum / divisor,
			ingredients: [{ ...newIngredient(), kcalPer100: +kcalPer100.toFixed(0), amount: amountSum }]
		};

		const id = eatUnits.add(eatUnit);
		goto('/edit/' + id);
	}
</script>

<div class="row center">
	<div class="col center">
		<h1>kcalCalc Calculator</h1>
		<div class="center row gap">
			<span>
				{amountSum.toFixed(0)} g|ml
			</span> <br />
			<span>
				{kcalPer100.toFixed(0)} kcal per 100x
			</span>
		</div>
		<span class="bold">
			{kcalSum.toFixed(0)} kcal
		</span>
	</div>
</div>

{#each ingredients as ingredient (ingredient.instanceId)}
	<div animate:flip={animationOptions}>
		<IngredientCalculator bind:ingredient>
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

<nav>
	<button on:click={addIngredient} class="primary"><IconPlus /> Zutat</button>
	<Dialog let:toggle>
		<svelte:fragment slot="trigger-label">
			<IconPortion />
		</svelte:fragment>
		<div class="col gap">
			<h2>Portionieren</h2>
			<Input type="number" bind:value={divisor} min="1">Personen</Input>
			<span>
				{kcalSum.toFixed(0)} kcal / {divisor.toFixed(0)} Personen =
				<span class="bold">{(kcalSum / divisor).toFixed(0)} kcal</span>
			</span>
			<button
				on:click={() => {
					saveAsUnit();
					toggle();
				}}
			>
				<IconPlus />
				als Einheit speichern
			</button>
		</div>
	</Dialog>
	<Dialog let:toggle>
		<svelte:fragment slot="trigger-label">
			<IconSave />
		</svelte:fragment>
		<h2>Zutaten speichern?</h2>
		<svelte:fragment slot="dialog-actions">
			<button on:click={toggle}> Doch nicht </button>
			<button
				on:click={() => {
					saveIngredients(ingredients);
					toggle();
				}}
			>
				<IconSave />
				Speichern
			</button>
		</svelte:fragment>
	</Dialog>
	<a href="/"><IconHome /></a>
</nav>
