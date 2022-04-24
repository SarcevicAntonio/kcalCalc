<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { calculateKcal } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import type { ItemInstance } from '$lib/stores/items';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPortion from '~icons/ic/round-photo-size-select-small';
	import ItemSelector from './ItemSelector.svelte';

	const dispatch = createEventDispatcher();

	export let item: ItemInstance;

	export let expanded = false;

	$: kcalLabel = kcalDisplay(calculateKcal(item));
</script>

<button on:click={() => (expanded = !expanded)} class="card outlined">
	<div class="row">
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
		<span class="label-l">
			{kcalLabel} kcal
		</span>
	</div>

	{#if expanded}
		<div transition:slide|local class="col" on:click|stopPropagation>
			<div class="pad" />
			{#if item.id.startsWith('CUSTOM')}
				<Input bind:value={item.label}>Custom Label</Input>
			{/if}

			{#if typeof item.id === 'string' && item.id.startsWith('CUSTOM')}
				{#if item.id === 'CUSTOM:KCAL+AMOUNT'}
					<Input type="calc" bind:value={item.kcalPer100}>kcal Per 100 g || ml</Input>
				{/if}
			{:else}
				<Input type="number" disabled value={item.kcalPer100}>kcal Per 100 g || ml</Input>
			{/if}
			<Input type="calc" bind:value={item.amount}>
				{#if item.id !== 'CUSTOM:KCAL_COUNT'}
					Amount in g || ml
				{:else}
					Kcal
				{/if}
			</Input>
			<div class="row">
				<button class="btn text" on:click={() => dispatch('delete')}>
					<IcDelete />
				</button>
				<button class="btn text">
					<IcPortion />
				</button>
				<ItemSelector
					edit
					on:select={({ detail }) => {
						item = detail;
					}}
				/>
			</div>
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

	.card {
		padding-bottom: 0;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 0.5em;
	}

	.item-info {
		min-height: 4.1em;
	}

	.pad {
		min-height: 0.5em;
	}
</style>
