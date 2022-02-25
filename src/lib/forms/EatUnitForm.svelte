<script lang="ts">
	import Input from '$lib/Input.svelte';
	import eatUnit, { type EatUnit } from '$lib/stores/eatUnit';

	let eatUnitInstance: EatUnit = {
		label: null,
		date: null,
		kcal: null,
		ingredientInstances: []
	};

	let trackingIngredients = false;
</script>

<Input type="date" bind:value={eatUnitInstance.date}>Datum</Input>

<Input type="text" bind:value={eatUnitInstance.label}>Label</Input>

<div class="row gap">
	<input id="tracking-ing" type="checkbox" bind:checked={trackingIngredients} />
	<label for="tracking-ing">Zutaten tracken</label>
</div>

{#if !trackingIngredients}
	<Input type="number" bind:value={eatUnitInstance.kcal}>kcal</Input>
{:else}
	{#each eatUnitInstance.ingredientInstances as ingredient}
		<button>
			{JSON.stringify(ingredient)}
		</button>
	{:else}
		... noch keine Zutaten
	{/each}
{/if}

<div class="fabs sb aic">
	{#if trackingIngredients}
		<button>➕</button>
	{:else}
		<div />
	{/if}
	<button
		class="primary"
		on:click={() => {
			eatUnit.add(eatUnitInstance);
			history.back();
		}}>☁</button
	>
</div>
