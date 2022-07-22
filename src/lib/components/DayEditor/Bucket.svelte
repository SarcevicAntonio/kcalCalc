<script type="ts">
	import ItemInstance from '$lib/components/ItemInstanceEditor.svelte';
	import type { ItemInstance as ItemInstanceType } from '$lib/data/items';
	import { calculateKcalFromItems, kcalDisplay } from '$lib/kcal';
	import ItemDrawer from '$lib/views/ItemDrawer/ItemDrawer.svelte';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	const dispatch = createEventDispatcher();

	export let label: string;
	export let items: ItemInstanceType[];

	let expanded = false;

	let consideredItem: ItemInstanceType;

	async function considerItem(item: ItemInstanceType) {
		consideredItem = item;
		await tick();
		amountInputElement.focus();
	}

	async function addItem(item: ItemInstanceType) {
		expanded = true;
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

<Dialog
	includedTrigger={false}
	open={!!consideredItem}
	noCloseButton
	on:dismiss={() => {
		consideredItem = null;
	}}
>
	<div class="col">
		<!-- <h2 class="headline-3 with-icon"><IcAdd /> Add Item</h2> -->
		<ItemInstance
			bind:amountInputElement
			inline
			bind:item={consideredItem}
			on:add={() => addItem(consideredItem)}
		/>
	</div>
</Dialog>

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
				<ItemDrawer
					selector
					on:select={({ detail }) => {
						considerItem(detail);
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
			<ItemDrawer
				selector
				on:select={({ detail }) => {
					considerItem(detail);
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

	.card.filled {
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
