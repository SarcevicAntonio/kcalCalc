<script lang="ts">
	import IngredientCalculator from '$lib/IngredientCalculator.svelte';
	import Input from '$lib/Input.svelte';
	import { newIngredient } from '$lib/stores/ingredients';
	import { Dialog } from 'as-comps';
	import IconPortion from '~icons/mdi/circle-slice-5';
	import IconDelete from '~icons/mdi/delete';
	import IconHome from '~icons/mdi/home';
	import IconPlus from '~icons/mdi/plus-thick';
	

	let ingredients = [newIngredient()];

	function addIngredient() {
		ingredients = [...ingredients, newIngredient()];
	}

	function removeIngredient(id) {
		ingredients = ingredients.filter((a) => {
			return a.id !== id;
		});
	}

	$: sum = ingredients.reduce((acc, ingredient) => {
		let kcal = (ingredient.kcalPer100 / 100) * ingredient.amount;
		return acc + kcal;
	}, 0);

	let divisor = 2;
</script>

<div class="row center">
	<div class="col center">
		<h1>kcalCalc Calculator</h1>
		<span class="bold">
			{sum.toFixed(0)} kcal
		</span>
	</div>
</div>

{#each ingredients as ingredient (ingredient.id)}
	<IngredientCalculator bind:ingredient hideLabel>
		<button
			on:click={() => {
				removeIngredient(ingredient.id);
			}}
		>
			<IconDelete />
		</button>
	</IngredientCalculator>
{/each}

<nav>
	<button on:click={addIngredient} class="primary"><IconPlus /> Zutat</button>
	<Dialog>
		<svelte:fragment slot="trigger-label">
			<IconPortion />
			Portionen
		</svelte:fragment>
		<div class="col gap">
			<h2>Portionieren</h2>

			<Input type="number" bind:value={divisor}>Dividend</Input>

			<span class="bold">{(sum / divisor).toFixed(0)} kcal</span>

			<button>Als Einheit speichern</button>
			//todo: button func
		</div>
	</Dialog>
	<a href="/"><IconHome /></a>
</nav>
