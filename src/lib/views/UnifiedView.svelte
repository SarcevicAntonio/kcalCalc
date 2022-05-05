<script>
	import BucketSkeleton from '$lib/components/DayEditor/BucketSkeleton.svelte';
	import DayEditor from '$lib/components/DayEditor/DayEditor.svelte';
	import KcalLimitBar from '$lib/components/KcalLimitBar.svelte';
	import KcalLimitBarSkeleton from '$lib/components/KcalLimitBarSkeleton.svelte';
	import WeekSwitcher from '$lib/components/WeekSwitcher.svelte';
	import { curDay, weekData } from '$lib/data/intake';
	import { userSettings } from '$lib/data/user';
	import { toISODateString } from '$lib/dateHelpers';
	import { calculateKcalFromItems, kcalDisplay } from '$lib/kcal';
	import { isSameDay, isSameWeek } from 'date-fns';
	import IcHome from '~icons/ic/round-home';
	import ItemDrawer from './ItemDrawer/ItemDrawer.svelte';

	// bug: scrolls into view when changing data
	// async function scrollToView(data) {
	// 	if (!Object.keys(data).length) return;
	// 	await tick();
	// 	const el = document.getElementById(toISODateString(new Date()));
	// 	if (!el) return;
	// 	el.scrollIntoView({
	// 		behavior: 'smooth',
	// 	});
	// }

	// $: scrollToView($weekData);

	$: entries = Object.entries($weekData);
</script>

<WeekSwitcher overrideData={entries.map(([_, data]) => data)} />

<div class="scroll-hori">
	{#each entries as [date, data] (date)}
		{@const dateObj = new Date(date)}
		{@const kcalInDay = data?.meals.reduce(
			(acc, meal) => acc + calculateKcalFromItems(meal.intake),
			0
		)}
		{@const today = isSameDay(dateObj, new Date())}
		<div class="flow">
			<div class="day-title" class:today>
				<span class="headline-2" id={date}>
					{#if today}
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
			<KcalLimitBar {kcalInDay} />
			<DayEditor bind:data {date} />
		</div>
	{:else}
		{#each { length: 7 } as _}
			<div class="flow">
				<div class="day-title">
					<div class="headline-2 skeleton">XX., X. XXX</div>
					<div class="labe-l skeleton">XXX kcal</div>
				</div>
				<KcalLimitBarSkeleton />
				{#each { length: 4 } as _}
					<BucketSkeleton />
				{/each}
			</div>
		{/each}
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

<style lang="postcss">
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
		padding: 0.5rem;
		border-radius: 0.75rem;
		border: 1px solid transparent;
	}

	.today {
		box-shadow: var(--shadow);
		border-color: var(--md-outline);
	}
</style>
