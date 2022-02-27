<script>
	import { page } from '$app/stores';
	import eatUnits from '$lib/stores/eatUnit';

	const { year, month } = $page.params;

	let curDate = new Date([year, month, '01'].join('-'));

	const today = new Date();

	const thisMonthString = today.toISOString().substring(0, 7);

	$: curDateString = curDate.toISOString().substring(0, 7);

	$: thisMonthsUnits = $eatUnits.filter((a) => a.date.substring(0, 7) === curDateString);

	$: daysInUnit = thisMonthsUnits.reduce((acc, curVal) => {
		const curValDay = curVal.date.substring(8, 10);
		if (acc.includes(curValDay)) {
			return acc;
		}
		return [...acc, curValDay];
	}, []);

	$: header = setHeader(curDate);

	$: monthName = curDate.toLocaleString('default', { month: 'long' });

	function setHeader(curDate) {
		return curDateString;
		// if (thisMonthString === curDateString) {
		// 	return 'test';
		// }
		// return curDate;
	}
</script>

<div class="row sb">
	<button
		class="ghost"
		on:click={() => {
			curDate.setMonth(curDate.getMonth() - 1);
			curDate = curDate;
		}}>⬅️</button
	>
	<div class="col center">
		<h1>{header}</h1>
		<span class="bold">{thisMonthsUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
	</div>
	<button
		class="ghost"
		on:click={() => {
			curDate.setMonth(curDate.getMonth() + 1);
			curDate = curDate;
		}}>➡️</button
	>
</div>

{#if daysInUnit}
	{#each daysInUnit as day}
		{@const dayDate = new Date(thisMonthString + '-' + day)}
		{@const thisDaysUnits = thisMonthsUnits.filter((a) => a.date.substring(8, 10) === day)}
		<a
			href="/{dayDate.toISOString().split('T')[0].replaceAll('-', '/')}"
			class="card"
			class:today={dayDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]}
		>
			<h2>{day}. {monthName}</h2>
			<div class="row sb">
				<span>
					{thisDaysUnits.length} Einheiten
				</span>
				<span class="bold">{thisDaysUnits.reduce((prev, next) => prev + next.kcal, 0)} kcal</span>
			</div>
		</a>
	{:else}
		... noch keine Einträge für diesen Monat
	{/each}
{/if}

<div class="fabs">
	{#if curDateString !== thisMonthString}
		<span />
		<button
			on:click={() => {
				curDate = new Date(today);
			}}>zu diesem Monat</button
		>
	{/if}
</div>

<style>
	.card {
		border: 0px solid transparent;
		background-color: unset;
		text-align: unset;
	}
	.today {
		border-bottom: 4px solid yellowgreen;
	}
</style>
