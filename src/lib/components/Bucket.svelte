<script>
	import kcalDisplay from '$lib/kcalDisplay';
	import IcAdd from '~icons/ic/round-add';
	import { slide } from 'svelte/transition';
	import Item from './Item.svelte';

	export let label;
	export let items;

	let expanded = false;
</script>

<div class="card filled col">
	<button class="row center sb" on:click={() => (expanded = !expanded)}>
		<span class="title-l">{label}</span>
		<div class="col end">
			{#if items.length}
				<span class="body-m">
					{items.length} Item{items.length !== 1 ? 's' : ''}
				</span>
				<span class="label-l">
					{kcalDisplay(items.reduce((acc, item) => acc + (item.kcalPer100 / 100) * item.amount, 0))}
					kcal
				</span>
			{:else}
				<button class="btn text" on:click|stopPropagation>
					<IcAdd />
					Add Item
				</button>
			{/if}
		</div>
	</button>

	{#if expanded && items.length}
		<div transition:slide class="col gap">
			<div class="spacer-s" />
			{#each items as item}
				<Item bind:item />
			{/each}
			<div class="row end">
				<button class="btn text">
					<IcAdd />
					Add Item
				</button>
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
		min-height: 0.75em;
	}
	.spacer-s {
		min-height: 0.25em;
	}
</style>
