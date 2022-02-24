<script>
	import Calculator from '$lib/Calculator.svelte';

	let ingredients = [];

	function addIngredient() {
		ingredients = [...ingredients, 0];
	}

	$: sum = ingredients.reduce((a, b) => {
		return a + b;
	}, 0);
</script>

{#each ingredients as ingredient, i (i)}
	<Calculator bind:kcal={ingredient} />
{/each}

<button on:click={addIngredient}>add ingredient</button>

<span>
	Summe: {sum}
</span>
