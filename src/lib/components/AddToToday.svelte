<script lang="ts">
	import { getDayData, setDayData, weekData, type Day } from '$lib/data/intake';
	import IcAdd from '~icons/ic/round-plus';

	import { instantiateItem, type Item } from '$lib/data/items';
	import { toISODateString } from '$lib/dateHelpers';
	import { Dialog } from 'as-comps';
	import ItemInstanceEditor from './ItemInstanceEditor.svelte';

	export let item: Item;
	let itemInstance = instantiateItem(item);
	let open = false;
	let todayDate = toISODateString(new Date());
	let todayData: Day;
	async function getCurrentDayInHere() {
		todayData = await getDayData(todayDate);
	}
	getCurrentDayInHere();

	async function addTo(mealLabel: string) {
		const mealIndex = todayData.meals.findIndex((meal) => meal.label === mealLabel);
		todayData.meals[mealIndex].intake = [...todayData.meals[mealIndex].intake, itemInstance];
		setDayData(todayDate, todayData);
		await weekData.reload();
		open = false;
	}
</script>

<Dialog bind:open noCloseButton --as-dialog-width="90%" --as-dialog-max-width="400px">
	<svelte:fragment slot="trigger-label"><IcAdd />Today</svelte:fragment>
	<ItemInstanceEditor inline bind:item={itemInstance}>
		<div slot="inline-btns" class="col">
			{#each todayData.meals as item}
				<button class="btn tonal w-auto" on:click={() => addTo(item.label)}>
					{item.label}
				</button>
			{/each}
		</div>
	</ItemInstanceEditor>
</Dialog>

<style>
	.col {
		margin-top: 1em;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5em;
	}
	.w-auto {
		width: auto;
	}
</style>
