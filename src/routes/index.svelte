<script>
	import Calculator from '$lib/Calculator.svelte';

	let ingredients = [];

	function addIngredient() {
		ingredients = [0, ...ingredients];
	}

	$: sum = ingredients.reduce((a, b) => {
		return a + b;
	}, 0);
</script>

{#each ingredients as ingredient, i}
	<Calculator bind:kcal={ingredient} />
{/each}

<button on:click={addIngredient}>add ingredient</button>

<span>
	Summe: {sum}
</span>
