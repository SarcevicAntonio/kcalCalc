<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { decodeUriComponentToObj } from '$lib/base64';
	import { curDay, dateIsToday, weekData } from '$lib/data/intake';
	import { saveExternalItem, type Item } from '$lib/data/items';
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

	let editId = null;

	const createDecodedItem = async (uriComponent: string) => {
		const item = decodeUriComponentToObj(uriComponent) as Item;
		await saveExternalItem(item);
		editId = item.id;
	};

	const uriComponent = $page.url.searchParams.get('add');
	if (uriComponent && browser) {
		createDecodedItem(uriComponent);
	}

	$: mobileView = innerWidth < 1000;
</script>

<svelte:window bind:innerWidth />

{#if mobileView}
	{#if showWeekGraph}
		<WeekGraph on:toggleWeekGraph={toggleWeekGraph} />
	{:else}
		<CurDayView on:toggleWeekGraph={toggleWeekGraph} />
	{/if}
{:else}
	<UnifiedView />
{/if}

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
	<ItemDrawer {editId} open={editId} />
</nav>

<style>
	@media only screen and (max-width: 1000px) {
		.home-btn {
			margin-left: auto;
		}
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
