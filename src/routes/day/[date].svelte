<script lang="ts">
	import { page } from '$app/stores';
	import Bucket from '$lib/components/Bucket.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import { dayIntake } from './_data';

	const dateIsToday = true;
	const curWeekNumber = 14;

	$: date = $page.params.date; // dynamic params!

	$: kcalInDay = Object.values(dayIntake).reduce(
		(acc, items) => acc + calculateKcalFromItems(items),
		0
	);
</script>

<Switcher>
	<h2 class="headline-1">Today</h2>
	<span class="label-l">
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

{#each Object.keys(dayIntake) as label}
	<Bucket {label} bind:items={dayIntake[label]} />
{/each}
<nav>
	<a href="/items"><IconItems /> Items</a>
	{#if dateIsToday}
		<button>
			<IconHome />
		</button>
	{/if}
	<a href="/week/{curWeekNumber}">
		<IconWeek />
		Week
	</a>
</nav>
