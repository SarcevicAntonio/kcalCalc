<script>
	import eatUnits from '$lib/stores/eatUnit';
</script>

<div class="row sb">
	<button class="ghost">⬅️</button>
	<div class="col center">
		<h1>Heute</h1>
		<span>{$eatUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
	</div>
	<button class="ghost">➡️</button>
</div>

{#if eatUnits}
	{#each $eatUnits as eatUnit}
		{JSON.stringify(eatUnit)}
		<button
			on:click={() => {
				eatUnits.remove(eatUnit.id);
			}}>löschen</button
		>
	{:else}
		... keine Einträge
	{/each}
{/if}

<div class="fabs">
	<a href="/eatunit/add" class="primary">➕</a>
</div>
