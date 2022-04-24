<script context="module" lang="ts">
	import Bucket from '$lib/components/Bucket.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { db } from '$lib/firebase';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { Load } from '@sveltejs/kit';
	import { addDays, formatISO, getISOWeek, getYear } from 'date-fns';
	import { doc, getDoc } from 'firebase/firestore';
	import IconWeek from '~icons/mdi/calendar-week';
	import IconItems from '~icons/mdi/format-list-bulleted-type';
	import IconHome from '~icons/mdi/house';
	import { defaultDay, type Day } from '../day/_data';

	export const load: Load = async ({ params }) => {
		const dateObj = new Date(params.date);
		const year = getYear(dateObj);
		const week = getISOWeek(dateObj);

		const docRef = doc(db, `Users/1/Years/${year}/Weeks/${week}/Days/${params.date}`);
		let data = (await getDoc(docRef)).data();

		if (!data) {
			data = defaultDay;
		}

		return {
			props: {
				data,
			},
		};
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let data: Day;

	const dateIsToday = true;

	$: dateObj = new Date($page.params.date);
	$: week = getISOWeek(dateObj);
	$: year = getYear(dateObj);

	function goToNext() {
		goto('/day/' + formatISO(addDays(dateObj, 1), { representation: 'date' }));
	}
	function goToPref() {
		goto('/day/' + formatISO(addDays(dateObj, -1), { representation: 'date' }));
	}

	$: kcalInDay = data?.meals.reduce((acc, meal) => acc + calculateKcalFromItems(meal.intake), 0);
</script>

<Switcher on:prev={goToPref} on:next={goToNext}>
	<h2 class="headline-1">Today</h2>
	<span class="label-l">
		{kcalDisplay(kcalInDay)} kcal
	</span>
</Switcher>

{#if data}
	{#each data.meals as { label, intake }}
		<Bucket {label} bind:items={intake} />
	{/each}
{/if}

<nav>
	<a href="/items"><IconItems /> Items</a>
	{#if dateIsToday}
		<button>
			<IconHome />
		</button>
	{/if}
	<a href="/{year}/{week}">
		<IconWeek />
		Week
	</a>
</nav>
