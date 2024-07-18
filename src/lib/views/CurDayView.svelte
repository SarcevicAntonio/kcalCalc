<script lang="ts">
	import DayEditor from '$lib/components/DayEditor/DayEditor.svelte'
	import KcalLimitBar from '$lib/components/KcalLimitBar.svelte'
	import KcalLimitBarSkeleton from '$lib/components/KcalLimitBarSkeleton.svelte'
	import Switcher from '$lib/components/Switcher.svelte'
	import {
		curDay,
		dateIsToday,
		dayData,
		type Day as DayType,
	} from '$lib/data/intake'
	import { userSettings } from '$lib/data/user'
	import { toISODateString } from '$lib/dateHelpers'
	import { calculateKcalFromItems, valueDisplay } from '$lib/kcal'
	import { calculateProteinFromItems } from '$lib/protein'
	import { addDays } from 'date-fns'

	let data = null as DayType
	let stale = false

	$: data = $dayData

	$: kcalInDay = data?.meals.reduce(
		(acc, meal) => acc + calculateKcalFromItems(meal.intake),
		0,
	)

	$: proteinInDay = data?.meals.reduce(
		(acc, meal) => acc + calculateProteinFromItems(meal.intake),
		0,
	)
	$: dateObj = new Date($curDay)

	function goToNext() {
		$curDay = toISODateString(addDays(dateObj, 1))
	}
	function goToPref() {
		$curDay = toISODateString(addDays(dateObj, -1))
	}
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1" class:stale>
		{#if $dateIsToday}
			Today
		{:else}
			{dateObj.toLocaleString(undefined, {
				month: 'short',
				day: 'numeric',
				weekday: 'short',
			})}
		{/if}
	</h2>
	<span
		class="label-l"
		class:over-limit={kcalInDay > ($userSettings?.kcalLimit || 9999)}
		class:stale
	>
		{valueDisplay(kcalInDay)} kcal
	</span>
	<span
		class="label-l"
		class:over-limit={proteinInDay > ($userSettings?.proteinLimit || 9999)}
		class:stale
	>
		{valueDisplay(proteinInDay)} protein
	</span>
</Switcher>

{#await dayData.load()}
	<KcalLimitBarSkeleton />
	<KcalLimitBarSkeleton />
{:then _}
	<KcalLimitBar amount={kcalInDay} limit={$userSettings?.kcalLimit} />
	<KcalLimitBar amount={proteinInDay} limit={$userSettings?.proteinLimit} />
{/await}

<DayEditor bind:data date={$curDay} />

<style>
	.over-limit {
		color: var(--md-error);
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
