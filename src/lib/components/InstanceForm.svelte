<script lang="ts">
	import type { ItemInstance } from '$lib/data/items'
	import Input from '$lib/Input.svelte'
	import { calculateKcal, valueDisplay } from '$lib/kcal'
	import { calculateProtein } from '$lib/protein'
	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

	export let item: ItemInstance

	function dispatchUpdate() {
		dispatch('update')
	}
</script>

<div class="col">
	{#if !item.id.startsWith('CUSTOM')}
		<span class="title-m">
			{item.label}
		</span>
	{/if}
	{#if item.brand}
		<span class="body-m">
			{item.brand}
		</span>
	{/if}
	{#if item.id.startsWith('CUSTOM')}
		<Input bind:value={item.label} on:input={dispatchUpdate}>
			Custom Label
		</Input>
	{:else}
		<div class="row">
			<div class="body-m">
				{valueDisplay(item.kcalPer100)} kcal Per 100x
			</div>
			<span class="label-l">
				{valueDisplay(calculateKcal(item))} kcal
			</span>
		</div>
		<div class="row">
			<div class="body-m">
				{valueDisplay(item.proteinPer100)} protein Per 100x
			</div>
			<span class="label-l">
				{valueDisplay(calculateProtein(item))} protein
			</span>
		</div>
	{/if}

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
