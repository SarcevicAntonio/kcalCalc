<script lang="ts">
	import type { ItemInstance } from '$lib/data/items'
	import { calculateKcal, valueDisplay } from '$lib/kcal'
	import { Dialog } from 'as-comps'
	import { createEventDispatcher } from 'svelte'
	import IcDelete from '~icons/ic/round-delete-forever'
	import InstanceForm from './InstanceForm.svelte'
	import PortionSelector from './PortionSelector.svelte'
	import { calculateProtein } from '$lib/protein'
	const dispatch = createEventDispatcher()

	export let item: ItemInstance
	export let amountInputElement: HTMLInputElement = null

	let editing = false

	function dispatchUpdate() {
		dispatch('update')
	}
</script>

<button class="card outlined row" on:click={() => (editing = true)}>
	<div class="col item-info">
		<span class="title-m">
			{#if !item.label}
				{#if item.id.startsWith('CUSTOM')}
					Custom Item
				{/if}
			{:else}
				{item.label}
			{/if}
		</span>
		{#if item.brand}
			<span class="body-m">
				{item.brand}
			</span>
		{/if}
	</div>
	<div class="col end">
		<span class="label-l">
			{valueDisplay(calculateKcal(item))} kcal
		</span>
		<span class="label-l">
			{valueDisplay(calculateProtein(item))} protein
		</span>
	</div>
</button>

<Dialog
	includedTrigger={false}
	data-testid="item-instance-editor"
	bind:isOpen={editing}
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
	transitionOptions={{ duration: 100 }}
>
	<InstanceForm bind:item bind:amountInputElement on:update>
		<svelte:fragment slot="inline-inputs">
			{#if item.portions.length}
				<PortionSelector
					portions={item.portions}
					on:select={({ detail }) => {
						item.amount = detail.amount
						dispatchUpdate()
						editing = false
					}}
					on:add={({ detail }) => {
						item.amount += detail.amount
						dispatchUpdate()
						editing = false
					}}
				/>
			{/if}
		</svelte:fragment>
		<div class="row">
			<button class="btn text" on:click={() => dispatch('delete')}>
				<IcDelete />
			</button>
		</div>
	</InstanceForm>
</Dialog>

<style>
	button {
		cursor: pointer;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 0.125rem;
	}

	.end {
		align-items: flex-end;
	}
</style>
