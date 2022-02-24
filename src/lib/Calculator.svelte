<script>
	import Input from './Input.svelte';

	let kcalPer100 = 0;
	let grams = 0;

	export let kcal = 0;

	$: kcal = (kcalPer100 / 100) * grams;
</script>

<div>
	<Input bind:value={kcalPer100}>kcal per 100g</Input>

	<Input bind:value={grams}>grams</Input>

	<span>
		{kcal} kcal
	</span>
</div>

<style>
	div {
		display: flex;
		align-items: flex-end;
		gap: 1em;
	}
</style>
