<script>
	import Input from '$lib/Input.svelte';
	import { calculateKcal } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { slide } from 'svelte/transition';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPortion from '~icons/ic/round-photo-size-select-small';
	import ItemSelector from './ItemSelector.svelte';

	export let item;

	let expanded = false;

	$: kcalLabel = kcalDisplay(calculateKcal(item));
</script>

<div class="card outlined col">
	<button class="row jcsb aistch inc-target" on:click={() => (expanded = !expanded)}>
		<div class="col ais jcc">
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
		<div class="col aie jcsb">
			{#if expanded}
				<ItemSelector edit />
			{:else}
				<span class="body-m">
					{#if item.id !== 'CUSTOM:KCAL_COUNT'}
						{item.amount} g || ml
					{:else}
						&nbsp;
					{/if}
				</span>
				<span class="label-l">
					{kcalLabel} kcal
				</span>
			{/if}
		</div>
	</button>

	{#if expanded}
		<div transition:slide|local class="col gap">
			<div class="spacer-s" />
			{#if typeof item.id === 'string' && item.id.startsWith('CUSTOM')}
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
			<div class="row jcsb aic">
				<button class="btn text">
					<IcDelete />
				</button>
				<button class="btn text">
					<IcPortion />
				</button>
				<div class="col aie">
					<span class="label-l"> {kcalLabel} kcal </span>
				</div>
			</div>
		</div>
	{/if}
	<div class="spacer-m" />
</div>

<style>
	.card {
		padding-bottom: 0;
	}
	.spacer-m {
		min-height: 0.5em;
	}
	.spacer-s {
		min-height: 0.25em;
	}
</style>
