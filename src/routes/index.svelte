<script>
	import eatUnits from '$lib/stores/eatUnit';
</script>

<div class="row sb">
	<button class="ghost">⬅️</button>
	<div class="col center">
		<h1>Heute</h1>
		<span class="bold">{$eatUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
	</div>
	<button class="ghost">➡️</button>
</div>

{#if eatUnits}
	{#each $eatUnits as { label, kcal, ingredients, id }}
		<a href="/eatunit/edit/{id}" class="card">
			<h2>{label}</h2>
			<div class="row sb">
				<span>
					{#if ingredients?.length}
						{ingredients.length} Zutaten
					{/if}
				</span>
				<span class="bold">{kcal} kcal</span>
			</div>
		</a>
	{:else}
		... keine Einträge
	{/each}
{/if}

<div class="fabs">
	<a href="/eatunit/add" class="primary">➕</a>
</div>
