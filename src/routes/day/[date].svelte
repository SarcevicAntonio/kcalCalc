<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Bucket from '$lib/components/Bucket.svelte';
	import Home from '$lib/components/Home.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { db } from '$lib/firebase';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { user, userSettings } from '$lib/stores/user';
	import { addDays, getISOWeek, getYear, isSameDay } from 'date-fns';
	import { doc, setDoc } from 'firebase/firestore';
	import IconItems from '~icons/ic/round-category';
	import IconWeek from '~icons/ic/round-date-range';
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

	async function updateData(newData: Day) {
		if (!browser || !$user || $navigating) return;

		await setDoc(
			doc(db, `Users/${$user.id}/Years/${year}/Weeks/${week}/Days/${$page.params.date}`),
			newData
		);
	}

	$: updateData(data);
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1">
		{#if dateIsToday}
			Today
		{:else}
			{dateObj.toLocaleString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
		{/if}
	</h2>
	{#await userSettings.load()}
		<span class="label-l">
			{kcalDisplay(kcalInDay)} kcal
		</span>
	{:then}
		<span class="label-l" class:over-limit={kcalInDay > $userSettings.kcalLimit}>
			{kcalDisplay(kcalInDay)} kcal
		</span>
	{/await}
</Switcher>

{#if data.meals}
	{#each data.meals as { label, intake }}
		<Bucket {label} bind:items={intake} />
	{/each}
{/if}

<nav>
	<a sveltekit:prefetch href="/items"><IconItems /> Items</a>
	{#if !dateIsToday}
		<Home />
	{/if}
	<a sveltekit:prefetch href="/{year}/{week}">
		<IconWeek />
		Week
	</a>
</nav>

<style>
	.over-limit {
		color: var(--md-error);
	}
</style>
