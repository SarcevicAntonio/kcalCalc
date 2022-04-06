<script lang="ts">
	import { page } from '$app/stores';
	import { ym, ymd } from '$lib/dateFormats';
	import eatUnits from '$lib/stores/eatUnit';
	import { addMonths, format } from 'date-fns';
	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconArrowRight from '~icons/mdi/arrow-right-bold';
	import IconMonth from '~icons/mdi/calendar-month';
	import IconHome from '~icons/mdi/house';

	const { year, month } = $page.params;

	let curDate = new Date([year, month, '01'].join('-'));

	const today = new Date();
	const todayString = format(today, ymd);
	const thisMonthString = format(today, ym);

	let curDateString: string;

	$: if (isFinite(+curDate)) {
		curDateString = format(curDate, ym);
	}

	$: thisMonthsUnits = $eatUnits
		.filter((a) => a.date.substring(0, 7) === curDateString)
		.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

	$: daysInUnit = thisMonthsUnits.reduce((acc, curVal) => {
		const curValDay = curVal.date.substring(8, 10);
		if (acc.includes(curValDay)) {
			return acc;
		}
		return [...acc, curValDay];
	}, []);

	$: header = setHeader(curDate);

	$: monthName = curDate.toLocaleString('default', { month: 'long' });

	function setHeader(curDate: Date) {
		if (today.getFullYear() === curDate.getFullYear()) {
			return curDate.toLocaleString(undefined, { month: 'long' });
		}

		return curDate.toLocaleString(undefined, { year: 'numeric', month: 'short' });
	}
</script>

<div class="row sb">
	<button
		class="ghost"
		on:click={() => {
			curDate = addMonths(curDate, -1);
		}}
	>
		<IconArrowLeft />
	</button>
	<div class="col center">
		<h1>{header}</h1>
		<span class="bold">
			{thisMonthsUnits.reduce((prev, next) => prev + next.kcal, 0).toFixed(0)} kcal
		</span>
	</div>
	<button
		class="ghost"
		on:click={() => {
			curDate = addMonths(curDate, 1);
		}}
	>
		<IconArrowRight />
	</button>
</div>

{#if daysInUnit}
	{#each daysInUnit as day}
		{@const dayDate = new Date(curDateString + '-' + day)}
		{@const dayDateString = format(dayDate, ymd)}
		{@const thisDaysUnits = thisMonthsUnits.filter((a) => a.date.substring(8, 10) === day)}
		<a
			href="/{dayDateString.replaceAll('-', '/')}"
			class="card"
			class:today={dayDateString === todayString}
		>
			<h2>{day}. {monthName}</h2>
			<div class="row sb">
				<span>
					{thisDaysUnits.length} Einheiten
				</span>
				<span class="bold">
					{thisDaysUnits.reduce((prev, next) => prev + next.kcal, 0).toFixed(0)} kcal
				</span>
			</div>
		</a>
	{:else}
		<div class="notice col">
			<p>... noch keine Einträge für diesen Monat</p>
		</div>
	{/each}
{/if}

<nav>
	{#if curDateString !== thisMonthString}
		<button
			on:click={() => {
				curDate = new Date(today);
			}}
		>
			<IconMonth /> akt. Monat
		</button>
	{/if}
	{#if !daysInUnit.length}
		<a href="/{todayString.replaceAll('-', '/')}">
			<IconHome />
		</a>
	{/if}
	<span />
</nav>

<style>
	.today {
		background-color: var(--md-surface);
		color: var(--md-on-surface);
		border: 1px solid var(--md-outline);
	}
</style>
