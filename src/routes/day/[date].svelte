<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Bucket from '$lib/components/Bucket.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { addDays, formatISO, getISOWeek, getYear, isSameDay } from 'date-fns';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import type { Day } from '../../lib/stores/intake';
	export let data: Day;

	$: dateObj = new Date($page.params.date);
	$: week = getISOWeek(dateObj);
	$: year = getYear(dateObj);
	$: dateIsToday = isSameDay(dateObj, new Date());

	function goToNext() {
		goto('/day/' + toISODateString(addDays(dateObj, 1)));
	}
	function goToPref() {
		goto('/day/' + toISODateString(addDays(dateObj, -1)));
	}

	$: kcalInDay = data?.meals.reduce((acc, meal) => acc + calculateKcalFromItems(meal.intake), 0);
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1">
		{#if dateIsToday}
			Today
		{:else}
			{dateObj.toLocaleString(undefined, { month: 'short', day: 'numeric' })}
		{/if}
	</h2>
	<span class="label-l">
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

{#if data.meals}
	{#each data.meals as { label, intake }}
		<Bucket {label} bind:items={intake} />
	{/each}
{/if}

<nav>
	<a href="/items"><IconItems /> Items</a>
	{#if !dateIsToday}
		<a href="/day/{toISODateString(new Date())}">
			<IconHome />
		</a>
	{/if}
	<a href="/{year}/{week}">
		<IconWeek />
		Week
	</a>
</nav>
