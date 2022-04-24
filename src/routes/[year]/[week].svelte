<script context="module" lang="ts">
	import { db } from '$lib/firebase';
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { Load } from '@sveltejs/kit';
	import {
		collection,
		getDocs,
		QuerySnapshot,
		type CollectionReference,
		type DocumentData,
	} from 'firebase/firestore';
	import type { Day } from '../day/_data';

	interface DayWithKcal extends Day {
		kcal: number;
	}
	interface Week {
		[date: string]: DayWithKcal;
	}

	export const load: Load = async ({ params }) => {
		const collectionRef: CollectionReference<DocumentData> = collection(
			db,
			`Users/1/Years/${params.year}/Weeks/${params.week}/Days`
		);

		const docsRefs: QuerySnapshot<DocumentData> = await getDocs(collectionRef);

		const data = {};

		docsRefs.docs.forEach((doc) => {
			const docData = doc.data();
			data[doc.id] = {
				...docData,
				kcal: docData.meals.reduce((acc, meal) => acc + calculateKcalFromItems(meal.intake), 0),
			};
		});

		return {
			props: {
				data,
			},
		};
	};
</script>

<script lang="ts">
	import Switcher from '$lib/components/Switcher.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getISOWeeksInYear, setISOWeek } from 'date-fns';

	export let data: Week;

	$: year = parseInt($page.params.year);
	$: week = parseInt($page.params.week);

	function goToNext() {
		let newYear = year;
		let newWeek = week + 1;

		const thisWeek = setISOWeek(new Date(year + ''), week);
		const weeks = getISOWeeksInYear(thisWeek);
		if (newWeek > weeks) {
			newYear = year + 1;
			newWeek = 1;
		}

		goto('/' + newYear + '/' + newWeek);
	}

	function goToPrev() {
		let newYear = year;
		let newWeek = week - 1;

		if (newWeek < 1) {
			newYear = year - 1;
			newWeek = getISOWeeksInYear(new Date(newYear + ''));
		}

		goto('/' + newYear + '/' + newWeek);
	}
</script>

<Switcher on:prev={goToPrev} on:next={goToNext}>
	<span>{year}</span>
	<h2 class="headline-1">Week {week}</h2>
	<span class="label-l">
		{kcalDisplay(Object.values(data).reduce((acc, day) => acc + day.kcal, 0))} kcal
	</span>
</Switcher>

{#each Object.entries(data) as [date, item]}
	<a class="card filled" href="/day/{date}">
		<div class="row">
			<span class="title-l">{new Date(date).toLocaleString('en-US', { weekday: 'long' })}</span>
			<span class="label-l">
				{kcalDisplay(item.kcal)}
				kcal
			</span>
		</div>
	</a>
{/each}

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 3em;
	}
</style>
