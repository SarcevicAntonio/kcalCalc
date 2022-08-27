<script lang="ts">
	import type { ItemInstance } from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import { calculateKcal, kcalDisplay } from '$lib/kcal';
	import { createEventDispatcher } from 'svelte';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcAdd from '~icons/ic/round-plus';
	import Expandable from './Expandable.svelte';
	import PortionSelector from './PortionSelector.svelte';
	const dispatch = createEventDispatcher();

	export let item: ItemInstance;

	$: kcalLabel = kcalDisplay(calculateKcal(item));

	function dispatchUpdate() {
		dispatch('update');
	}
</script>

<button class="card outlined row">
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
</style>
