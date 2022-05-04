<script lang="ts">
	import CurDayView from '$lib/components/CurDayView.svelte';
	import UnifiedView from '$lib/components/UnifiedView.svelte';
	import WeekGraph from '$lib/components/WeekGraph.svelte';

	let innerWidth;

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
{:else}
	<UnifiedView />
{/if}

<style>
	.row {
		display: flex;
	}
	.title-l {
		min-height: 2em;
	}
</style>
