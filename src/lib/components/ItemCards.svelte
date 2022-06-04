<script lang="ts">
	import type { Item } from '$lib/data/items';
	import { calculateKcalPer100FromItems, kcalDisplay } from '$lib/kcal';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ select: Item }>();

	export let items: Item[] = [];
	export let excludeId = '';
	export let skeletonId: string = '';
</script>

{#each items as item (item.id)}
	{#if item.id !== excludeId}
		<button
			class="card filled"
			on:click={() => {
				dispatch('select', item);
			}}
			class:skeleton={skeletonId === item.id}
		>
			<div class="row">
				<span class="title-l">{item.label}</span>
				<span class="body-m">
					{#if item.portions?.length}
						{item.portions.length} port.
					{/if}
				</span>
			</div>
			<div class="row">
				<span class="body-m">
					{item.brand}
				</span>
				<span class="label-l">
					{kcalDisplay(item.kcalPer100 || calculateKcalPer100FromItems(item.items, item.amount))} kcal%g||ml
				</span>
			</div>
		</button>
	{/if}
{:else}
	<p class="none">
		<slot />
	</p>
{/each}

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.row {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.none {
		display: flex;
		align-items: center;
		align-self: center;
		gap: 0.5em;
		opacity: 0.8;
	}
</style>
