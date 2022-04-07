<script>
	import Bucket from '$lib/components/Bucket.svelte';
	import Item from '$lib/components/Item.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import { intake } from './_data';

	const dateIsToday = true;
	const curWeekNumber = 14;
</script>

<Switcher>
	today
	<br />
	xxx kcal
</Switcher>

{#each intake as { label, items }}
	<Bucket {label} {items} />
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
