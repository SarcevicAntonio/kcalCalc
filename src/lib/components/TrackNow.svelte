<script lang="ts">
	import { defaultDay, getDayData, setDayData, weekData, type Day } from '$lib/data/intake';
	import { instantiateItem, type Item, type ItemInstance } from '$lib/data/items';
	import { toISODateString } from '$lib/dateHelpers';
	import { Dialog } from 'as-comps';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	export let item: Item;
	export let todayDate = toISODateString(new Date());

	let itemInstance: ItemInstance;
	let open = false;
	let todayData: Day;

	async function startFlow() {
		itemInstance = await instantiateItem(item);
		if (!itemInstance) return;
		open = true;
	}

	async function addTo(mealLabel: string) {
		todayData = await getDayData(todayDate);
		const mealIndex = todayData.meals.findIndex((meal) => meal.label === mealLabel);
		todayData.meals[mealIndex].intake = [...todayData.meals[mealIndex].intake, itemInstance];
		setDayData(todayDate, todayData);
		await weekData.reload();
		open = false;
	}
</script>

<button on:click={startFlow}>
	<IcRoundPlaylistAdd />
</button>

<Dialog
	bind:open
	noCloseButton
	includedTrigger={false}
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<div class="col">
		<h2 class="headline-3 with-icon">
			<IcRoundPlaylistAdd />
			Track Item
		</h2>
		<input type="date" bind:value={todayDate} />
		Select a bucket for {todayDate}
		{#each defaultDay.meals as item}
			<button class="btn tonal fill" on:click={() => addTo(item.label)}>
				{item.label}
			</button>
		{/each}
	</div>
</Dialog>

<style>
	.col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5em;
	}

	.fill {
		width: 100%;
	}
</style>
