<script lang="ts">
	import ItemInstanceEditor from '$lib/components/ItemInstanceEditor.svelte'
	import type { ItemInstance as ItemInstanceType } from '$lib/data/items'
	import { calculateKcalFromItems, valueDisplay } from '$lib/kcal'
	import ItemDrawer from '$lib/views/ItemDrawer/ItemDrawer.svelte'
	import { createEventDispatcher } from 'svelte'
	import Expandable from '../Expandable.svelte'
	import { calculateProteinFromItems } from '$lib/protein'
	const dispatch = createEventDispatcher()

	export let label: string
	export let date: string
	export let items: ItemInstanceType[]

	let open = false

	async function addItem(item: ItemInstanceType) {
		open = true
		items = [...items, item]
		dispatch('update')
	}

	function delItem(index: number) {
		items.splice(index, 1)
		items = items
		dispatch('update')
	}
</script>

<Expandable
	bind:open
	disabled={!items.length}
	data-testid="bucket-button-{label}-{date}"
>
	<div slot="summary" class="row">
		<span class="title-l">{label}</span>
		<div class="bucket-info">
			{#if items.length}
				<span class="label-l">
					{valueDisplay(calculateKcalFromItems(items))}
					kcal
				</span>
				<span class="label-l">
					{valueDisplay(calculateProteinFromItems(items))}
					protein
				</span>
			{:else}
				<ItemDrawer
					triggerTestId="track-item-{label}-{date}"
					selector
					on:select={({ detail }) => {
						addItem(detail)
					}}
				/>
			{/if}
		</div>
	</div>

	<div class="col" data-testid="bucket-{label}-{date}">
		{#if items.length}
			{#each items as item, index (item.key)}
				<ItemInstanceEditor
					bind:item
					on:delete={() => delItem(index)}
					on:update
				/>
			{/each}
			<ItemDrawer
				selector
				on:select={({ detail }) => {
					addItem(detail)
				}}
			/>
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
		gap: 1em;
		margin-top: 0.5rem;
	}

	.title-l {
		display: flex;
		align-items: center;
		min-height: 2em;
	}
</style>
