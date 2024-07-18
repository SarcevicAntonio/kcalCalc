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
	{#if item.id.startsWith('CUSTOM')}
		<Input bind:value={item.label} on:input={dispatchUpdate}>
			Custom Label
		</Input>
	{/if}
	<div class="row">
		<div class="body-m">
			{kcalDisplay(item.kcalPer100)} kcal Per 100x
		</div>
		<span class="label-l">
			{kcalLabel} kcal
		</span>
	</div>
	{#if item.id.startsWith('CUSTOM')}
		<div class="row">
			<Input type="calc" bind:value={item.kcalPer100} on:input={dispatchUpdate}>
				kcal Per 100x
			</Input>
		</div>
		<div class="row">
			<Input
				type="calc"
				bind:value={item.proteinPer100}
				on:input={dispatchUpdate}
			>
				protein Per 100x
			</Input>
		</div>
	{/if}
	<div class="row gap">
		<Input
			bind:inputElement={amountInputElement}
			type="calc"
			bind:value={item.amount}
			on:input={dispatchUpdate}
		>
			Amount
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
