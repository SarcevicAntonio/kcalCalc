<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import animationOptions from '$lib/animationOptions';
	import eatUnits from '$lib/stores/eatUnit';
	import { flip } from 'svelte/animate';
	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconArrowRight from '~icons/mdi/arrow-right-bold';
	import IconMonth from '~icons/mdi/calendar-month';
	import IconHome from '~icons/mdi/home';
	import IconPlus from '~icons/mdi/plus-thick';

	const { year, month, day } = $page.params;

	let curDate = new Date([year, month, day].join('-'));

	const today = new Date();

	const todayString = today.toISOString().split('T')[0];

	let curDateString = '';
	let monthSwitchHref = '';

	$: if (isFinite(+curDate)) {
		curDateString = curDate.toISOString().split('T')[0];
		monthSwitchHref = '/' + curDate.toISOString().split('T')[0].replace('-', '/').split('-')[0];
	}

	$: curDateUnits = $eatUnits.filter((a) => a.date === curDateString);

	function setHeader(curDateString) {
		if (todayString === curDateString) {
			return 'Heute';
		} else if (today.getFullYear() === curDate.getFullYear()) {
			return curDate.toLocaleString(undefined, { month: 'short', day: 'numeric' });
		}
		return curDate.toLocaleString(undefined, { year: '2-digit', month: 'short', day: 'numeric' });
	}

	$: header = setHeader(curDateString);

	function newUnit() {
		let eatUnit = {
			label: null,
			date: curDateString,
			kcal: 100,
			ingredients: []
		};

		const id = eatUnits.add(eatUnit);
		goto('/edit/' + id);
	}
</script>

<div class="row sb">
	<button
		class="ghost"
		on:click={() => {
			curDate.setDate(curDate.getDate() - 1);
			curDate = curDate;
		}}
	>
		<IconArrowLeft />
	</button>
	<div class="col center">
		<h1>{header}</h1>
		<span class="bold">
			{curDateUnits.reduce((prev, next) => prev + next.kcal, 0).toFixed(0)} kcal
		</span>
	</div>
	<button
		class="ghost"
		on:click={() => {
			curDate.setDate(curDate.getDate() + 1);
			curDate = curDate;
		}}
	>
		<IconArrowRight />
	</button>
</div>
{#if curDateUnits}
	{#each curDateUnits as { label, kcal, ingredients, id } (id)}
		<a href="/edit/{id}" class="card" animate:flip={animationOptions}>
			<h2>{label || 'Kein Label'}</h2>
			<div class="row sb">
				<span>
					{#if ingredients?.length}
						{ingredients.length} Zutaten
					{/if}
				</span>
				<span class="bold">{kcal.toFixed(0)} kcal</span>
			</div>
		</a>
	{:else}
		<div class="notice">... noch keine Einträge für diesen Tag</div>
	{/each}
{/if}

<nav>
	<button on:click={newUnit} class="primary"><IconPlus /> Einheit</button>
	{#if curDateString !== todayString}
		<button
			on:click={() => {
				curDate = new Date(today);
			}}
		>
			<IconHome />
		</button>
	{/if}
	<a href={monthSwitchHref}>
		<IconMonth />
		{#if curDateString === todayString}
			{curDate.toLocaleString(undefined, { month: 'long' })}
		{/if}
	</a>
</nav>
