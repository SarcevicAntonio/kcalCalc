<script>
	import { curDay, curWeek, curYear, weekData } from '$lib/data/intake'
	import { userSettings } from '$lib/data/user'
	import { toISODateString } from '$lib/dateHelpers'
	import { calculateKcalFromItems, valueDisplay } from '$lib/kcal'
	import { addDays, getYear } from 'date-fns'
	import Switcher from './Switcher.svelte'

	export let overrideData = null

	function goToNext() {
		$curDay = toISODateString(addDays(new Date($curDay), +7))
	}

	function goToPrev() {
		$curDay = toISODateString(addDays(new Date($curDay), -7))
	}

	$: kcalSum = (overrideData || Object.values($weekData)).reduce((acc, day) => {
		return (
			acc +
				day.meals.reduce(
					(acc, meal) => acc + calculateKcalFromItems(meal.intake),
					0,
				) || 0
		)
	}, 0)
</script>

<Switcher on:prev={goToPrev} on:next={goToNext}>
	{#if $curYear !== getYear(new Date())}
		<span>{$curYear}</span>
	{/if}
	<h2 class="headline-1">Week {$curWeek}</h2>
	<span
		class="label-l"
		class:over-limit={kcalSum > ($userSettings?.kcalLimit || 9999) * 7}
	>
		{valueDisplay(kcalSum)} kcal
	</span>
</Switcher>
