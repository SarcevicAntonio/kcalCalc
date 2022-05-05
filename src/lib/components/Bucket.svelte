<script type="ts">
	import { calculateKcalFromItems } from '$lib/kcal';
	import { kcalDisplay } from '$lib/kcal';
	import type { ItemInstance as ItemInstanceType } from '$lib/stores/items';
	import { createEventDispatcher, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import ItemInstance from './ItemInstance.svelte';
	import ItemSelector from './ItemSelector.svelte';
	const dispatch = createEventDispatcher();

	export let label: string;
	export let items: ItemInstanceType[];

	let expanded = false;

	async function addItem(item: ItemInstanceType) {
		expanded = true;
		await tick();
		items = [...items, item];
		dispatch('update');
	}

	function delItem(index: number) {
		items.splice(index, 1);
		items = items;
		dispatch('update');
	}
</script>

<button class="card filled" on:click={() => (expanded = !expanded)}>
	<div class="row">
		<span class="title-l">{label}</span>
		<div class="bucket-info">
			{#if items.length}
				<span class="body-m">
					{items.length} Item{items.length !== 1 ? 's' : ''}
				</span>
				<span class="label-l">
					{kcalDisplay(calculateKcalFromItems(items))}
					kcal
				</span>
			{:else}
				<ItemSelector
					on:select={({ detail }) => {
						addItem(detail);
					}}
				/>
			{/if}
		</div>
	</div>

	{#if expanded && items.length}
		<div transition:slide|local class="col" on:click|stopPropagation>
			<div class="pad" />
			{#each items as item, index (item.key)}
				<ItemInstance bind:item on:delete={() => delItem(index)} on:update />
			{/each}
			<ItemSelector
				end
				on:select={({ detail }) => {
					addItem(detail);
				}}
			/>
		</div>
	{/if}
	<div class="pad" />
</button>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	button {
		padding-bottom: 0;
	}

	.bucket-info {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 0.5em;
	}

	.title-l {
		display: flex;
		align-items: center;
		min-height: 2em;
	}

	.pad {
		min-height: 0.5rem;
	}
</style>
