<script>
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import IconWeek from '~icons/mdi/calendar-week';
	import Bucket from '$lib/components/Bucket.svelte';

	const dateIsToday = true;
	const curWeekNumber = 14;
</script>

{#each ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as label}
	<Bucket {label}>
		<div class="card inner">
			<div class="title-m">item</div>
		</div>
	</Bucket>
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
