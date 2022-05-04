<script lang="ts">
	import CurDayView from '$lib/components/CurDayView.svelte';
	import ItemDrawer from '$lib/components/ItemDrawer.svelte';
	import UnifiedView from '$lib/components/UnifiedView.svelte';
	import WeekGraph from '$lib/components/WeekGraph.svelte';
	import IconWeek from '~icons/ic/round-date-range';
	import { toISODateString } from '$lib/dateHelpers';
	import { curDay, dateIsToday, weekData } from '$lib/stores/intake';
	import IcHome from '~icons/ic/round-home';
	import IcToday from '~icons/ic/round-today';

	let innerWidth: number;

	let showWeekGraph = false;
	const toggleWeekGraph = () => {
		showWeekGraph = !showWeekGraph;
	};
</script>

<svelte:window bind:innerWidth />

{#if innerWidth < 1000}
	{#if showWeekGraph}
		<WeekGraph on:toggleWeekGraph={toggleWeekGraph} />
	{:else}
		<CurDayView on:toggleWeekGraph={toggleWeekGraph} />
	{/if}
	<nav class="fab-bar">
		{#if !showWeekGraph}
			<button
				on:click={async () => {
					await weekData.reload();
					toggleWeekGraph();
				}}
			>
				<IconWeek />
				Week
			</button>
		{/if}
		{#if !$dateIsToday}
			<button
				on:click={() => {
					$curDay = toISODateString(new Date());
				}}
			>
				<IcHome />
			</button>
		{/if}
		<ItemDrawer />
	</nav>
{:else}
	<UnifiedView />
{/if}

<style>
</style>
