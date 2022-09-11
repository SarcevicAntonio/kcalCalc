<script lang="ts">
	import { getDayData, setDayData, weekData, type Day } from '$lib/data/intake';
	import { instantiateItem, type Item } from '$lib/data/items';
	import { toISODateString } from '$lib/dateHelpers';
	import { Dialog } from 'as-comps';
	import IcAdd from '~icons/ic/round-plus';
	import InstanceForm from './InstanceForm.svelte';

	export let item: Item;
	export let todayDate = toISODateString(new Date());

	let state = 'selectingAmount';

	let itemInstance = instantiateItem(item);
	let open = false;
	let todayData: Day;

	async function getCurrentDayInHere() {
		todayData = await getDayData(todayDate);
	}

	function setAmount() {
		state = 'selectingBucket';
	}

	async function addTo(mealLabel: string) {
		const mealIndex = todayData.meals.findIndex((meal) => meal.label === mealLabel);
		todayData.meals[mealIndex].intake = [...todayData.meals[mealIndex].intake, itemInstance];
		setDayData(todayDate, todayData);
		await weekData.reload();
		open = false;
		state = 'selectingAmount';
	}

	getCurrentDayInHere();
</script>

TODO

<!-- 
<Dialog
	bind:open
	on:dismiss={() => {
		state = 'selectingAmount';
	}}
	noCloseButton
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<svelte:fragment slot="trigger-label"><IcAdd />Today</svelte:fragment>
	<div class="col">
		{#if state !== 'selectingBucket'}
			<InstanceForm bind:item={itemInstance}>
				<svelte:fragment slot="inline-inputs">
					<button class="btn tonal" on:click={() => setAmount()}>
						<IcAdd /> Add
					</button>
				</svelte:fragment>
				{#each item.portions as portion}
					<button
						class="btn tonal fill"
						on:click={() => {
							itemInstance.amount = portion.amount;
							setAmount();
						}}
					>
						<IcAdd /> Add {portion.label} ({portion.amount} g|ml)
					</button>
				{/each}
			</InstanceForm>
		{:else}
			Select a bucket for {todayDate}
			{#each todayData.meals as item}
				<button class="btn tonal w-auto" on:click={() => addTo(item.label)}>
					{item.label}
				</button>
			{/each}
		{/if}
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
</style> -->
