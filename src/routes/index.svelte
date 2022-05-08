<script lang="ts">
	import { curDay, dateIsToday, weekData } from '$lib/data/intake';
	import { toISODateString } from '$lib/dateHelpers';
	import CurDayView from '$lib/views/CurDayView.svelte';
	import ItemDrawer from '$lib/views/ItemDrawer/ItemDrawer.svelte';
	import UnifiedView from '$lib/views/UnifiedView.svelte';
	import WeekGraph from '$lib/views/WeekGraph.svelte';
	import IconWeek from '~icons/ic/round-date-range';
	import IcHome from '~icons/ic/round-home';

	let innerWidth: number;

	let showWeekGraph = false;
	const toggleWeekGraph = () => {
		showWeekGraph = !showWeekGraph;
	};

	$: mobileView = innerWidth < 1000;
</script>

<svelte:window bind:innerWidth />

<nav class="fab-bar">
	{#if !showWeekGraph && mobileView}
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
			class="home-btn"
			on:click={() => {
				$curDay = toISODateString(new Date());
			}}
		>
			<IcHome />
		</button>
	{/if}
	<ItemDrawer />
</nav>

{#if mobileView}
	{#if showWeekGraph}
		<WeekGraph on:toggleWeekGraph={toggleWeekGraph} />
	{:else}
		<CurDayView on:toggleWeekGraph={toggleWeekGraph} />
	{/if}
{:else}
	<UnifiedView />
{/if}

<style>
	.home-btn {
		margin-left: auto;
	}
	/* @media only screen and (min-width: 1000px) {
		.fab-bar {
			top: 0;
			bottom: auto;
			padding-left: 12rem;
			padding-right: 2.5rem;
		}
	} */
</style>
