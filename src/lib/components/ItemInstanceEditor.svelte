<script lang="ts">
	import type { ItemInstance } from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import { calculateKcal, kcalDisplay } from '$lib/kcal';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcAdd from '~icons/ic/round-plus';
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
		<span class="body-m">
			{item.amount} g || ml
		</span>
		<span class="label-l">
			{kcalLabel} kcal
		</span>
	</div>
</button>

<Dialog
	includedTrigger={false}
	bind:open={editing}
	--as-dialog-padding="0.75em"
	--as-dialog--close-btn-top="0.75em"
	--as-dialog--close-btn-right="0.75em"
>
	<div class="col">
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
		<div class="body-m">
			{kcalDisplay(item.kcalPer100)} kcal Per 100x
		</div>
		<div class="row gap">
			{#if item.id === 'CUSTOM:KCAL+AMOUNT'}
				<Input type="calc" bind:value={item.kcalPer100} on:input={dispatchUpdate}>
					kcal Per 100x
				</Input>
			{/if}
			<Input
				bind:inputElement={amountInputElement}
				type="calc"
				bind:value={item.amount}
				on:input={dispatchUpdate}
			>
				{#if item.id !== 'CUSTOM:KCAL_COUNT'}
					Amount
				{:else}
					Kcal
				{/if}
			</Input>
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
		</div>
		<div class="row">
			<button class="btn text" on:click={() => dispatch('delete')}>
				<IcDelete />
			</button>
			<span class="label-l">
				{kcalLabel} kcal
			</span>
		</div>
	</div>
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
		gap: 0.5rem;
	}

	.end {
		align-items: flex-end;
	}

	.gap {
		gap: 0.5em;
	}
</style>
