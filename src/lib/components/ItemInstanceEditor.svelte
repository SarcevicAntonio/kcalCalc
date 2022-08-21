<script lang="ts">
	import type { ItemInstance } from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import { calculateKcal, kcalDisplay } from '$lib/kcal';
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcAdd from '~icons/ic/round-plus';
	import PortionSelector from './PortionSelector.svelte';
	const dispatch = createEventDispatcher();

	export let item: ItemInstance;

	export let inline = false;
	export let expanded = inline;
	export let amountInputElement: HTMLInputElement = null;

	$: kcalLabel = kcalDisplay(calculateKcal(item));

	function dispatchUpdate() {
		dispatch('update');
	}
</script>

<button
	on:click={() => {
		expanded = !expanded;
	}}
	class="card outlined"
	disabled={inline}
	class:non-expanding={inline}
>
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
		<div class="col end">
			<span class="body-m">
				{item.amount} g || ml
			</span>
			<span class="label-l">
				{kcalLabel} kcal
			</span>
		</div>
	</div>
	{#if expanded}
		<div transition:slide|local class="col" on:click|stopPropagation on:keyup|preventDefault>
			<div class="pad" />
			{#if item.id.startsWith('CUSTOM')}
				<Input bind:value={item.label} on:input={dispatchUpdate}>Custom Label</Input>
			{/if}
			{#if inline}
				<div class="col">
					{#each item.portions as portion}
						<button
							class="btn tonal fill"
							on:click={() => {
								item.amount = portion.amount;
								dispatch('add');
							}}
						>
							{portion.label} ({portion.amount} g|ml)
						</button>
					{/each}
				</div>
			{/if}
			<div class="row gap">
				{#if typeof item.id === 'string' && item.id.startsWith('CUSTOM')}
					{#if item.id === 'CUSTOM:KCAL+AMOUNT'}
						<Input type="calc" bind:value={item.kcalPer100} on:input={dispatchUpdate}>
							kcal Per 100x
						</Input>
					{/if}
				{:else}
					<Input type="number" disabled value={kcalDisplay(item.kcalPer100)}>kcal Per 100x</Input>
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
			</div>
			{#if !inline}
				<div class="row">
					<button class="btn text" on:click={() => dispatch('delete')}>
						<IcDelete />
					</button>
					{#if item.portions?.length}
						<PortionSelector
							portions={item.portions}
							on:select={({ detail }) => {
								item.amount = detail.amount;
								dispatchUpdate();
							}}
							on:add={({ detail }) => {
								item.amount += detail.amount;
								dispatchUpdate();
							}}
						/>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	<div class="pad" />
	{#if inline}
		<slot name="inline-btns">
			<button class="btn tonal fill" on:click={() => dispatch('add')}>
				<IcAdd /> Add Item
			</button>
		</slot>
	{/if}
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
		gap: 0.5rem;
	}

	.pad {
		min-height: 0.5rem;
	}

	.end {
		align-items: flex-end;
	}

	.gap {
		gap: 1em;
	}

	.non-expanding {
		border: none;
		padding: 0;
	}

	.fill {
		width: 100%;
	}
</style>
