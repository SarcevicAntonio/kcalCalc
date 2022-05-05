<script lang="ts">
	import { browser } from '$app/env';
	import Switcher from '$lib/components/Switcher.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { calculateKcalFromItems } from '$lib/kcal';
	import { kcalDisplay } from '$lib/kcal';
	import { user, userSettings } from '$lib/stores/user';
	import { addDays } from 'date-fns';
	import { createEventDispatcher } from 'svelte';
	import { curDay, dateIsToday, getDayData, type Day as DayType } from '../../lib/stores/intake';
	import Day from './DayEditor.svelte';
	const dispatch = createEventDispatcher();

	let data = null as DayType;
	let stale = false;

	async function getDayDataInHere(date, user) {
		stale = true;
		if (!browser || !user) return;
		data = await getDayData(date);
		stale = false;
	}

	$: getDayDataInHere($curDay, $user);

	$: kcalInDay = data?.meals.reduce((acc, meal) => acc + calculateKcalFromItems(meal.intake), 0);
	$: dateObj = new Date($curDay);

	function goToNext() {
		$curDay = toISODateString(addDays(dateObj, 1));
	}
	function goToPref() {
		$curDay = toISODateString(addDays(dateObj, -1));
	}
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1" class:stale>
		{#if $dateIsToday}
			Today
		{:else}
			{dateObj.toLocaleString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
		{/if}
	</h2>
	<span
		class="label-l"
		class:over-limit={kcalInDay > ($userSettings?.kcalLimit || 9999)}
		class:stale
	>
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

<Day bind:data date={$curDay} />

<style>
	.over-limit {
		color: var(--md-error);
	}

	.stale {
		animation: loading 2s infinite alternate;
	}

	@keyframes loading {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.33;
		}
	}
</style>
