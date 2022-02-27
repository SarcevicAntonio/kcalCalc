<script>
	import curDate from '$lib/stores/curDate';

	import eatUnits from '$lib/stores/eatUnit';

	let today = new Date();

	let todayString = today.toISOString().split('T')[0];

	$: curDateString = $curDate.toISOString().split('T')[0];

	$: curDateUnits = $eatUnits.filter((a) => a.date === curDateString);

	$: header = setHeader(curDateString);

	function setHeader(curDateString) {
		if (todayString === curDateString) {
			return 'Heute';
		}
		return curDateString;
	}
</script>

<div class="row sb">
	<button
		class="ghost"
		on:click={() => {
			$curDate.setDate($curDate.getDate() - 1);
			$curDate = $curDate;
		}}>⬅️</button
	>
	<div class="col center">
		<a href="/months" class="monthSwitch">
			<h1>{header}</h1>
			<span class="bold">{curDateUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
		</a>
	</div>
	<button
		class="ghost"
		on:click={() => {
			$curDate.setDate($curDate.getDate() + 1);
			$curDate = $curDate;
		}}>➡️</button
	>
</div>

{#if curDateUnits}
	{#each curDateUnits as { label, kcal, ingredients, id, date }}
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
		... noch keine Einträge für diesen Tag
	{/each}
{/if}

<div class="fabs">
	<a href="/eatunit/add" class="primary">➕</a>
	{#if curDateString !== todayString}
		<button
			on:click={() => {
				$curDate = new Date(today);
			}}>zu Heute</button
		>
	{/if}
</div>

<style>
	.monthSwitch {
		display: contents;
		color: unset;
	}
</style>
