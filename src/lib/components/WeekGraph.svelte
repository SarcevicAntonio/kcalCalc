<script lang="ts">
	import ItemDrawer from '$lib/components/ItemDrawer.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import kcalDisplay from '$lib/kcalDisplay';
	import { curDay, dateIsToday, weekData, type Week } from '$lib/stores/intake';
	import { userSettings } from '$lib/stores/user';
	import type { Loadable } from '@square/svelte-store';
	import { createEventDispatcher } from 'svelte';
	import IcHome from '~icons/ic/round-home';
	import WeekSelector from './WeekSelector.svelte';
	const dispatch = createEventDispatcher();

	export let data: Loadable<Week> = weekData;

	$: maxKcal = Math.max(...Object.values($data).map(({ kcal }) => kcal || 0));
</script>

<WeekSelector />

<div class="col">
	{#if $userSettings && maxKcal > $userSettings.kcalLimit}
		<div class="line" style="top:{(($userSettings?.kcalLimit || 0) / maxKcal) * 100}%;" />
	{/if}

	{#each Object.entries($data) as [date, item] (date)}
		<button
			class="card filled row"
			style={!isNaN(maxKcal) ? `height: ${(item?.kcal / maxKcal) * 100}%;` : ''}
			on:click={() => {
				$curDay = date;
				dispatch('toggleWeekGraph');
			}}
		>
			<span class="title-m">{new Date(date).toLocaleString(undefined, { weekday: 'narrow' })}</span>
			{#if item?.kcal}
				<span
					class="label-m end"
					class:over-limit={item?.kcal > ($userSettings?.kcalLimit || 9999)}
				>
					{kcalDisplay(item.kcal)}
					kcal
				</span>
			{/if}
		</button>
	{:else}
		{#each { length: 7 } as _}
			<div class="card filled row skeleton" />
		{/each}
	{/each}
</div>

<nav>
	<ItemDrawer />
	<button
		on:click={() => {
			$curDay = toISODateString(new Date());
			dispatch('toggleWeekGraph');
		}}
	>
		<IcHome />
	</button>
</nav>

<style>
	.col {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		height: calc(100vh - 12rem);
		gap: 0.25rem;
	}

	.row {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 2.5rem;
		flex-basis: 100%;
		flex-grow: 1;
		gap: 1.1em;
	}

	.end {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		margin-top: auto;
		white-space: nowrap;
	}

	.over-limit {
		color: var(--md-error);
	}

	.line {
		width: 100%;
		border-top: 1px solid var(--md-error);
		opacity: 0.8;
		border-top-style: dashed;
		position: absolute;
	}
</style>
