<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Home from '$lib/components/Home.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { Day } from '$lib/stores/intake';
	import { userSettings } from '$lib/stores/user';
	import { getISOWeeksInYear, getYear, setISOWeek, setYear } from 'date-fns';
	import IconItems from '~icons/ic/round-category';

	interface DayWithKcal extends Day {
		kcal: number;
	}

	interface Week {
		[date: string]: DayWithKcal;
	}

	export let data: Week;

	$: kcalSum = Object.values(data).reduce((acc, day) => acc + day.kcal || 0, 0);
	$: maxKcal = Math.max(...Object.values(data).map(({ kcal }) => kcal || 0));
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
	<span class="label-l" class:over-limit={kcalSum > ($userSettings?.kcalLimit || 9999) * 7}>
		{kcalDisplay(kcalSum)} kcal
	</span>
</Switcher>

<div class="col">
	{#if $userSettings && maxKcal > $userSettings.kcalLimit}
		<div class="line" style="top:{(($userSettings?.kcalLimit || 0) / maxKcal) * 100}%;" />
	{/if}
	{#each Object.entries(data) as [date, item] (date)}
		<a
			class="card filled row"
			sveltekit:prefetch
			href="/day/{date}"
			style={!isNaN(maxKcal) ? `height: ${(item?.kcal / maxKcal) * 100}%;` : ''}
		>
			<span class="title-l">{new Date(date).toLocaleString(undefined, { weekday: 'narrow' })}</span>
			<span class="label-l end" class:over-limit={item?.kcal > ($userSettings?.kcalLimit || 9999)}>
				{#if item?.kcal}
					{kcalDisplay(item.kcal)}
					kcal
				{/if}
			</span>
		</a>
	{/each}
</div>

<nav>
	<a sveltekit:prefetch href="/items"><IconItems /> Items</a>
	<Home />
</nav>

<style>
	.col {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		height: calc(100vh - 12em);
	}

	.row {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 2.8em;
	}

	.end {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		margin-top: auto;
		min-width: 1.5em;
	}

	.over-limit {
		color: var(--md-error);
	}

	.line {
		width: 100%;
		border-top: 1px solid var(--md-error);
		opacity: 0.8;
		border-top-style: dashed;
		position: absolute;
	}
</style>
