<script>
	import { toISODateString } from '$lib/dateHelpers';
	import kcalDisplay from '$lib/kcalDisplay';
	import { curDay, curWeek, curYear, weekData } from '$lib/stores/intake';
	import { userSettings } from '$lib/stores/user';
	import { addDays, getYear } from 'date-fns';
	import Switcher from './Switcher.svelte';

	function goToNext() {
		$curDay = toISODateString(addDays(new Date($curDay), +7));
	}

	function goToPrev() {
		$curDay = toISODateString(addDays(new Date($curDay), -7));
	}

	$: kcalSum = Object.values($weekData).reduce((acc, day) => acc + day.kcal || 0, 0);
</script>

<Switcher on:prev={goToPrev} on:next={goToNext}>
	{#if $curYear !== getYear(new Date())}
		<span>{$curYear}</span>
	{/if}
	<h2 class="headline-1">Week {$curWeek}</h2>
	<span class="label-l" class:over-limit={kcalSum > ($userSettings?.kcalLimit || 9999) * 7}>
		{kcalDisplay(kcalSum)} kcal
	</span>
</Switcher>
