<script lang="ts">
	import IconHome from '~icons/mdi/house';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Switcher from '$lib/components/Switcher.svelte';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { Day } from '$lib/stores/intake';
	import { getISOWeeksInYear, getYear, isSameYear, setISOWeek, setYear } from 'date-fns';
	import { toISODateString } from '$lib/dateHelpers';

	interface DayWithKcal extends Day {
		kcal: number;
	}

	interface Week {
		[date: string]: DayWithKcal;
	}

	export let data: Week;

	$: year = parseInt($page.params.year);
	$: week = parseInt($page.params.week);

	function goToNext() {
		let newYear = year;
		let newWeek = week + 1;

		const thisWeek = setISOWeek(setYear(new Date(), year), week);
		const weeks = getISOWeeksInYear(thisWeek);
		if (newWeek > weeks) {
			newYear = year + 1;
			newWeek = 1;
		}

		goto('/' + newYear + '/' + newWeek);
	}

	function goToPrev() {
		let newYear = year;
		let newWeek = week - 1;

		if (newWeek < 1) {
			newYear = year - 1;
			newWeek = getISOWeeksInYear(new Date(newYear + ''));
		}

		goto('/' + newYear + '/' + newWeek);
	}
</script>

<Switcher on:prev={goToPrev} on:next={goToNext}>
	{#if year !== getYear(new Date())}
		<span>{year}</span>
	{/if}
	<h2 class="headline-1">Week {week}</h2>
	<span class="label-l">
		{kcalDisplay(Object.values(data).reduce((acc, day) => acc + day.kcal || 0, 0))} kcal
	</span>
</Switcher>

{#each Object.entries(data) as [date, item]}
	<a class="card filled" href="/day/{date}">
		<div class="row">
			<span class="title-l">{new Date(date).toLocaleString(undefined, { weekday: 'long' })}</span>
			{#if item?.kcal}
				<span class="label-l">
					{kcalDisplay(item.kcal)}
					kcal
				</span>
			{/if}
		</div>
	</a>
{/each}

<nav>
	<a href="/day/{toISODateString(new Date())}">
		<IconHome />
	</a>
</nav>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 3em;
	}
</style>
