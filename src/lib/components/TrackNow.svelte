<script lang="ts">
	import { defaultDay, getDayData, setDayData, weekData, type Day } from '$lib/data/intake'
	import type { Item, ItemInstance } from '$lib/data/items'
	import { toISODateString } from '$lib/dateHelpers'
	import { Dialog, notification, removeNotification } from 'as-comps'
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add'
	import { createInstance } from './InstanceCreator'
	export let item: Item
	export let todayDate = toISODateString(new Date())

	let itemInstance: ItemInstance
	let isOpen = false
	let todayData: Day

	async function startFlow() {
		itemInstance = await createInstance(item)
		if (!itemInstance) return
		isOpen = true
	}

	async function addTo(mealLabel: string) {
		const notificationId = notification(`Tracking ${itemInstance.label}...`)
		isOpen = false
		todayData = await getDayData(todayDate)
		const mealIndex = todayData.meals.findIndex(meal => meal.label === mealLabel)
		todayData.meals[mealIndex].intake = [...todayData.meals[mealIndex].intake, itemInstance]
		await setDayData(todayDate, todayData)
		removeNotification(notificationId)
	}
</script>

<button
	on:click={startFlow}
	data-testid="track-now"
>
	<IcRoundPlaylistAdd />
</button>

<Dialog
	bind:isOpen
	includedTrigger={false}
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<div class="col">
		<h2 class="headline-3 with-icon">
			<IcRoundPlaylistAdd />
			Track Item
		</h2>
		<input
			type="date"
			bind:value={todayDate}
		/>
		Select a bucket for {todayDate}
		{#each defaultDay.meals as item}
			<button
				class="btn tonal fill"
				on:click={() => addTo(item.label)}
			>
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
