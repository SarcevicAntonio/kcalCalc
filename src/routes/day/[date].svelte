<script lang="ts">
	import Bucket from '$lib/components/Bucket.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { ItemInstance } from '$lib/stores/items';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import { day } from './_data';

	const dateIsToday = true;
	const curWeekNumber = 14;

	// $: date = $page.params.date; // dynamic params!

	$: kcalInDay = Object.values(day.intake).reduce(
		(acc, items: ItemInstance[]) => acc + calculateKcalFromItems(items),
		0
	);
</script>

<Switcher>
	<h2 class="headline-1">Today</h2>
	<span class="label-l">
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

{#each Object.keys(day.intake) as label}
	<Bucket {label} bind:items={day.intake[label]} />
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
