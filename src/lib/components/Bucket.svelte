<script>
	import { calculateKcalFromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { slide } from 'svelte/transition';
	import IcAdd from '~icons/ic/round-add';
	import Item from './Item.svelte';
	import ItemSelector from './ItemSelector.svelte';

	export let label;
	export let items;

	let expanded = false;
</script>

<div class="card filled col">
	<button class="row center jcsb inc-target" on:click={() => (expanded = !expanded)}>
		<span class="title-l">{label}</span>
		<div class="col aie jcsb">
			{#if items.length}
				<span class="body-m">
					{items.length} Item{items.length !== 1 ? 's' : ''}
				</span>
				<span class="label-l">
					{kcalDisplay(calculateKcalFromItems(items))}
					kcal
				</span>
			{:else}
				<ItemSelector />
			{/if}
		</div>
	</button>

	{#if expanded && items.length}
		<div transition:slide|local class="col gap">
			<div class="spacer-s" />
			{#each items as item}
				<Item bind:item />
			{/each}
			<div class="row end">
				<ItemSelector />
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
