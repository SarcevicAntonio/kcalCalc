<script>
	import { v4 as uuidv4 } from 'uuid';

	import Calculator from '$lib/Calculator.svelte';

	let ingredients = [
		{
			id: uuidv4(),
			kcal: 0
		}
	];

	function addIngredient() {
		ingredients = [
			...ingredients,
			{
				id: uuidv4(),
				kcal: 0
			}
		];
	}

	function removeIngredient(id) {
		ingredients = ingredients.filter((a) => {
			return a.id !== id;
		});
	}

	$: sum = ingredients.reduce((a, b) => {
		return a + b.kcal;
	}, 0);

	$: console.log(ingredients);
</script>

<ul>
	{#each ingredients as ingredient (ingredient.id)}
		<li>
			<Calculator bind:kcal={ingredient.kcal}>
				<button
					on:click={() => {
						removeIngredient(ingredient.id);
					}}
				>
					❌
				</button>
			</Calculator>
		</li>
	{/each}
</ul>

<button class="add" on:click={addIngredient}>add ingredient</button>

<span>
	Summe: {sum.toFixed(2)}
</span>

<style>
	.add {
		display: block;
		margin-block: 1em;
	}
	ul,
	li {
		all: unset;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
