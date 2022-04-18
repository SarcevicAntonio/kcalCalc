<script>
	import { page } from '$app/stores';
	import Bucket from '$lib/components/Bucket.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import kcalDisplay from '$lib/kcalDisplay';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import { intake } from './_data';

	const dateIsToday = true;
	const curWeekNumber = 14;

	$: date = $page.params.date; // dynamic params!
</script>

{date}

<Switcher>
	<h2 class="headline-1">Today</h2>
	<span class="label-l">
		{kcalDisplay(
			intake.reduce(
				(acc, { items }) =>
					acc + items.reduce((acc, item) => acc + (item.kcalPer100 / 100) * item.amount, 0),
				0
			)
		)} kcal
	</span>
</Switcher>

{#each intake as { label, items }}
	<Bucket {label} bind:items />
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
