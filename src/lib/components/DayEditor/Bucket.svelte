<script type="ts">
	import ItemInstanceEditor from '$lib/components/ItemInstanceEditor.svelte'
	import type { ItemInstance as ItemInstanceType } from '$lib/data/items'
	import { calculateKcalFromItems, kcalDisplay } from '$lib/kcal'
	import ItemDrawer from '$lib/views/ItemDrawer/ItemDrawer.svelte'
	import { createEventDispatcher } from 'svelte'
	import Expandable from '../Expandable.svelte'
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
	<div
		slot="summary"
		class="row"
	>
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
					triggerTestId="track-item-{label}-{date}"
					selector
					on:select={({ detail }) => {
						addItem(detail)
					}}
				/>
			{/if}
		</div>
	</div>

	<div
		class="col"
		data-testid="bucket-{label}-{date}"
	>
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
		gap: 0.5em;
	}

	.title-l {
		display: flex;
		align-items: center;
		min-height: 2em;
	}
</style>
