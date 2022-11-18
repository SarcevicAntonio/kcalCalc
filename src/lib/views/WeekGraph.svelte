<script lang="ts">
	import { kcalDisplay } from '$lib/kcal'
	import { curDay, weekData, type Week } from '$lib/data/intake'
	import { userSettings } from '$lib/data/user'
	import type { Loadable } from '@square/svelte-store'
	import { isSameDay } from 'date-fns'
	import { createEventDispatcher } from 'svelte'
	import WeekSwitcher from '$lib/components/WeekSwitcher.svelte'
	const dispatch = createEventDispatcher()

	export let data: Loadable<Week> = weekData

	$: maxKcal = Math.max(...Object.values($data).map(({ kcal }) => kcal || 0))
</script>

<WeekSwitcher />

<div class="col">
	{#if $userSettings && maxKcal > $userSettings.kcalLimit}
		<div
			class="line"
			style="top:{(($userSettings?.kcalLimit || 0) / maxKcal) * 100}%;"
		/>
	{/if}

	{#each Object.entries($data) as [date, item] (date)}
		{@const dateObj = new Date(date)}
		<button
			class="card filled row"
			class:today={isSameDay(dateObj, new Date())}
			style={!isNaN(maxKcal) ? `height: ${(item?.kcal / maxKcal) * 100}%;` : ''}
			on:click={() => {
				$curDay = date
				dispatch('toggleWeekGraph')
			}}
		>
			<span class="title-m">
				{dateObj.toLocaleString(undefined, { weekday: 'narrow' })}
			</span>
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

	.line {
		width: 100%;
		border-top: 1px solid var(--md-error);
		opacity: 0.8;
		border-top-style: dashed;
		position: absolute;
	}

	.today {
		border: 1px solid var(--md-outline);
		box-shadow: var(--shadow);
	}
</style>
