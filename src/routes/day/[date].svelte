<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Bucket from '$lib/components/Bucket.svelte';
	import Home from '$lib/components/Home.svelte';
	import ItemDrawer from '$lib/components/ItemDrawer.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { user, userSettings } from '$lib/stores/user';
	import { addDays, getISOWeek, getYear, isSameDay } from 'date-fns';
	import IconWeek from '~icons/ic/round-date-range';
	import { getDayData, setDayData, weekData, type Day } from '../../lib/stores/intake';

	let data = null as Day;

	let stale = false;

	async function getDayDataInHere(date, user) {
		stale = true;
		if (!browser || !user) return;
		data = await getDayData(date);
		stale = false;
	}

	$: getDayDataInHere($page.params.date, $user);

	$: kcalInDay = data?.meals.reduce((acc, meal) => acc + calculateKcalFromItems(meal.intake), 0);
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

	async function updateData() {
		if (!browser || !$user || $navigating) return;
		setDayData($page.params.date, data);
	}
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1" class:stale>
		{#if dateIsToday}
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

{#if data?.meals}
	{#each data.meals as { label, intake } ($page.params.date + label)}
		<Bucket {label} bind:items={intake} on:update={updateData} />
	{/each}
{:else}
	{#each { length: 4 } as _}
		<ItemSkeleton>
			<div class="row">
				<span class="title-l">Fake Bucket</span>
				<button class="btn text"> <IconWeek /> </button>
			</div>
		</ItemSkeleton>
	{/each}
{/if}

<nav>
	<ItemDrawer />
	{#if !dateIsToday}
		<Home />
	{/if}
	<button
		on:click={async () => {
			await weekData.reload();
			goto(`/${year}/${week}`);
		}}
	>
		<IconWeek />
		Week
	</button>
</nav>

<style>
	.over-limit {
		color: var(--md-error);
	}

	.row {
		display: flex;
	}

	.title-l {
		min-height: 2em;
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
