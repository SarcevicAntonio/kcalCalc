<script lang="ts">
	import type { ItemInstance } from '$lib/data/items'
	import Input from '$lib/Input.svelte'
	import { calculateKcal, kcalDisplay } from '$lib/kcal'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let amountInputElement: HTMLInputElement = null
	export let item: ItemInstance

	$: kcalLabel = kcalDisplay(calculateKcal(item))

	function dispatchUpdate() {
		dispatch('update')
	}
</script>

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
	{#if item.id.startsWith('CUSTOM')}
		<Input bind:value={item.label} on:input={dispatchUpdate}>Custom Label</Input>
	{/if}
	<div class="row">
		<div class="body-m">
			{kcalDisplay(item.kcalPer100)} kcal Per 100x
		</div>
		<span class="label-l">
			{kcalLabel} kcal
		</span>
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
		<slot name="inline-inputs" />
	</div>

	<slot />
</div>

<style>
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

	.gap {
		gap: 0.5em;
	}
</style>
