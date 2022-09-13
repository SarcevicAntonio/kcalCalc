<script lang="ts">
	import type { ItemInstance } from '$lib/data/items';
	import { calculateKcal, kcalDisplay } from '$lib/kcal';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcDelete from '~icons/ic/round-delete-forever';
	import InstanceForm from './InstanceForm.svelte';
	import PortionSelector from './PortionSelector.svelte';
	const dispatch = createEventDispatcher();

	export let item: ItemInstance;
	export let amountInputElement: HTMLInputElement = null;

	let editing = false;

	$: kcalLabel = kcalDisplay(calculateKcal(item));

	function dispatchUpdate() {
		dispatch('update');
	}
</script>

<button class="card outlined row" on:click={() => (editing = true)}>
	<div class="col item-info">
		<span class="title-m">
			{#if !item.label}
				{#if item.id === 'CUSTOM:KCAL_COUNT'}
					Custom kcal count
				{:else if item.id === 'CUSTOM:KCAL+AMOUNT'}
					Custom kcal & amount
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
			{kcalLabel} kcal
		</span>
	</div>
</button>

<Dialog
	noCloseButton
	includedTrigger={false}
	bind:open={editing}
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<InstanceForm bind:item bind:amountInputElement on:update>
		<svelte:fragment slot="inline-inputs">
			{#if item.portions.length}
				<PortionSelector
					portions={item.portions}
					on:select={({ detail }) => {
						item.amount = detail.amount;
						dispatchUpdate();
						editing = false;
					}}
					on:add={({ detail }) => {
						item.amount += detail.amount;
						dispatchUpdate();
						editing = false;
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
