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
	import { calculateKcalFromItems, kcalDisplay } from '$lib/kcal'
	import { addDays } from 'date-fns'

	let data = null as DayType
	let stale = false

	$: data = $dayData

	$: kcalInDay = data?.meals.reduce(
		(acc, meal) => acc + calculateKcalFromItems(meal.intake),
		0
	)
	$: dateObj = new Date($curDay)

	function goToNext() {
		$curDay = toISODateString(addDays(dateObj, 1))
	}
	function goToPref() {
		$curDay = toISODateString(addDays(dateObj, -1))
	}
</script>

<Switcher
	on:prev={goToPref}
	on:next={goToNext}
>
	<h2
		class="headline-1"
		class:stale
	>
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
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

{#await dayData.load()}
	<KcalLimitBarSkeleton />
{:then _}
	<KcalLimitBar {kcalInDay} />
{/await}

<DayEditor
	bind:data
	date={$curDay}
/>

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
