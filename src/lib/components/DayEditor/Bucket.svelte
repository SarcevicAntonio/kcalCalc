<script type="ts">
	import ItemInstanceEditor from '$lib/components/ItemInstanceEditor.svelte';
	import type { ItemInstance as ItemInstanceType } from '$lib/data/items';
	import { calculateKcalFromItems, kcalDisplay } from '$lib/kcal';
	import { createEventDispatcher, tick } from 'svelte';
	import Expandable from '../Expandable.svelte';
	const dispatch = createEventDispatcher();

	export let label: string;
	export let items: ItemInstanceType[];

	let open = false;

	let consideredItem: ItemInstanceType;

	async function considerItem(item: ItemInstanceType) {
		consideredItem = item;
		await tick();
		amountInputElement.focus();
	}

	async function addItem(item: ItemInstanceType) {
		open = true;
		await tick();
		items = [...items, item];
		dispatch('update');
		consideredItem = null;
	}

	function delItem(index: number) {
		items.splice(index, 1);
		items = items;
		dispatch('update');
	}

	let amountInputElement: HTMLInputElement;
</script>

<Expandable bind:open disabled={!items.length}>
	<div slot="summary" class="row">
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
				TODO: open adder
			{/if}
		</div>
	</div>

	<div class="col">
		{#if items.length}
			{#each items as item, index (item.key)}
				<ItemInstanceEditor bind:item on:delete={() => delItem(index)} on:update />
			{/each}
			TODO: open adder
		{/if}
	</div>
</Expandable>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
</style>
