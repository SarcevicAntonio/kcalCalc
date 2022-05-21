<script lang="ts">
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import type { Item } from '$lib/data/items';
	import { user } from '$lib/data/user';
	import { calculateKcalPer100FromItems, kcalDisplay } from '$lib/kcal';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ select: Item }>();

	export let items: Item[] = [];
	export let disableNotOwned = false;
	export let dontShowSkeletons = false;
	export let excludeId = '';
	export let skeletonId: string = '';
</script>

{#each items as item (item.id)}
	{@const owner = item.owner ? $user.id === item.owner : true}
	{#if item.id !== excludeId}
		<button
			class="card filled"
			disabled={disableNotOwned && !owner}
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
	{#if !dontShowSkeletons}
		{#each { length: 10 } as _}
			<ItemSkeleton />
		{/each}
	{:else}
		... no items found
	{/if}
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
</style>
