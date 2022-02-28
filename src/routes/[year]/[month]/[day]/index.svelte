<script>
	import { page } from '$app/stores';
	import eatUnits from '$lib/stores/eatUnit';

	const { year, month, day } = $page.params;

	let curDate = new Date([year, month, day].join('-'));

	const today = new Date();

	const todayString = today.toISOString().split('T')[0];

	let curDateString = '';
	let monthSwitchHref = '';

	$: if (isFinite(+curDate)) {
		curDateString = curDate.toISOString().split('T')[0];
		monthSwitchHref = '/' + curDate.toISOString().split('T')[0].replace('-', '/').split('-')[0];
	}

	$: curDateUnits = $eatUnits.filter((a) => a.date === curDateString);

	function setHeader(curDateString) {
		if (todayString === curDateString) {
			return 'Heute';
		} else if (today.getFullYear() === curDate.getFullYear()) {
			return curDate.toLocaleString(undefined, { month: 'short', day: 'numeric' });
		}
		return curDate.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' });
	}

	$: header = setHeader(curDateString);
</script>

<div class="row sb">
	<button
		class="ghost"
		on:click={() => {
			curDate.setDate(curDate.getDate() - 1);
			curDate = curDate;
		}}>⬅️</button
	>
	<div class="col center">
		<h1>{header}</h1>
		<span class="bold">{curDateUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
	</div>
	<button
		class="ghost"
		on:click={() => {
			curDate.setDate(curDate.getDate() + 1);
			curDate = curDate;
		}}>➡️</button
	>
</div>
{#if curDateUnits}
	{#each curDateUnits as { label, kcal, ingredients, id }}
		<a href="/{curDateString.replaceAll('-', '/')}/edit/{id}" class="card">
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
		<div class="notice">... noch keine Einträge für diesen Tag</div>
	{/each}
{/if}

<nav>
	<a href="/{curDateString.replaceAll('-', '/')}/add" class="primary">➕ Einheit</a>
	{#if curDateString !== todayString}
		<button
			on:click={() => {
				curDate = new Date(today);
			}}
		>
			📆 Heute
		</button>
	{/if}
	<a href={monthSwitchHref}>📅 {curDate.toLocaleString(undefined, { month: 'long' })} </a>

	<a href="/">🏠</a>
</nav>
