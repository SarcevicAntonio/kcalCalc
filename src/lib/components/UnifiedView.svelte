<script>
	import { toISODateString } from '$lib/dateHelpers';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { curDay, weekData } from '$lib/stores/intake';
	import { userSettings } from '$lib/stores/user';
	import { isSameDay, isSameWeek } from 'date-fns';
	import IcHome from '~icons/ic/round-home';
	import Day from './Day.svelte';
	import ItemDrawer from './ItemDrawer.svelte';
	import WeekSelector from './WeekSelector.svelte';

	// function scrollToView(data) {
	// 	console.log(Object.keys(data))
	// 	if (!Object.keys(data).length) return;
	// 	const el = document.getElementById(toISODateString(new Date('2022-05-07')));
	// 	console.log(el)
	// 	el.scrollIntoView({
	// 		behavior: 'smooth',
	// 	});
	// }
</script>

<WeekSelector />
<div class="scroll-hori">
	{#each Object.entries($weekData) as [date, data] (date)}
		{@const dateObj = new Date(date)}
		{@const kcalInDay = data?.meals.reduce(
			(acc, meal) => acc + calculateKcalFromItems(meal.intake),
			0
		)}
		<div class="flow">
			<div class="day-title">
				<span class="headline-2" id={date}>
					{#if isSameDay(dateObj, new Date())}
						Today
					{:else}
						{dateObj.toLocaleString(undefined, {
							month: 'short',
							day: 'numeric',
							weekday: 'short',
						})}
					{/if}
				</span>
				<span class="label-l" class:over-limit={kcalInDay > ($userSettings?.kcalLimit || 9999)}>
					{kcalDisplay(kcalInDay)} kcal
				</span>
			</div>
			<Day bind:data {date} />
		</div>
	{/each}
</div>

<nav class="fab-bar">
	{#if !isSameWeek(new Date(), new Date($curDay))}
		<button
			on:click={() => {
				$curDay = toISODateString(new Date());
			}}
		>
			<IcHome />
		</button>
	{:else}
		<span />
	{/if}
	<ItemDrawer />
</nav>

<style>
	.scroll-hori {
		display: flex;
		overflow-x: auto;
		gap: 1.2rem;
		padding-inline: 0.5rem;
	}

	.flow {
		min-width: 300px;
	}

	.day-title {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding-inline: 0.5rem;
	}
</style>
