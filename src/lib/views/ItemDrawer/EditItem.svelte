<script lang="ts">
	import ItemInstance from '$lib/components/ItemInstanceEditor.svelte';
	import ItemSelector from '$lib/components/ItemInstanceSelector.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Input from '$lib/Input.svelte';
	import { calculateAmountSum, calculateKcalPer100FromItems } from '$lib/kcal';
	import { kcalDisplay } from '$lib/kcal';
	import {
		createItemStore,
		defaultPortion,
		deleteItem,
		items,
		type Item,
		type ItemInstance as ItemInstanceType,
	} from '$lib/data/items';
	import type { WritableLoadable } from '@square/svelte-store';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher, onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPlus from '~icons/ic/round-plus';
	import ItemDrawer from './ItemDrawer.svelte';
	const dispatch = createEventDispatcher();

	export let id: string;
	export let selector = false;

	let dataStore: WritableLoadable<Item> = createItemStore(id);

	let sumInputEl = null;
	let activeEl = undefined;
	function update() {
		activeEl = document.activeElement;
	}
	onMount(() => {
		document.addEventListener('focus', update, true);
		document.addEventListener('blur', update, true);
		return () => {
			document.removeEventListener('focus', update, true);
			document.removeEventListener('blur', update, true);
		};
	});

	async function addItem(newItem: ItemInstanceType) {
		$dataStore.kcalPer100 = 0;
		$dataStore.items = [...$dataStore.items, newItem];
	}
</script>

<h2 class="headline-1">Edit Item</h2>

{#await dataStore.load()}
	<Input disabled>Label</Input>
	<Input disabled>Brand / Date / Whatever</Input>
	<Input disabled>kcal per 100 g || ml</Input>

	{#each { length: 2 } as _}
		<ItemSkeleton>
			<div class="row">
				<h3 class="headline-4">Portions</h3>
				<button class="btn text add">
					<IcPlus /> Add
				</button>
			</div>
		</ItemSkeleton>
	{/each}
{:then}
	<Input bind:value={$dataStore.label}>Label</Input>
	<Input bind:value={$dataStore.brand}>Brand / Date / Whatever</Input>

	{#if !$dataStore.items.length}
		<Input type="calc" bind:value={$dataStore.kcalPer100}>kcal per 100 g || ml</Input>
	{:else}
		<Input
			type="calc"
			disabled
			value={kcalDisplay(calculateKcalPer100FromItems($dataStore.items, $dataStore.amount))}
		>
			kcal per 100 g || ml
		</Input>
	{/if}

	<div class="card filled col">
		<div class="row">
			<h3 class="headline-4">Items</h3>
			<ItemDrawer
				selector
				noCustomKcal
				excludeId={id}
				on:select={({ detail }) => {
					addItem(detail);
				}}
			/>
		</div>
		{#each $dataStore.items as child, index (child.key)}
			<ItemInstance
				bind:item={child}
				on:delete={() => {
					$dataStore.items.splice(index, 1);
					if (!$dataStore.items.length) $dataStore.kcalPer100 = 100;
					$dataStore = $dataStore;
				}}
			/>
		{/each}
		{#if $dataStore.items.length}
			<div class="row">
				<input
					aria-label="Override Amount"
					id="override-amount"
					type="checkbox"
					checked={$dataStore.amount ? true : false}
					on:input={() => {
						if ($dataStore.amount) {
							$dataStore.amount = 0;
						} else {
							$dataStore.amount = calculateAmountSum($dataStore.items) || 100;
						}
					}}
				/>
				{#if $dataStore.amount || activeEl === sumInputEl}
					<Input type="calc" bind:value={$dataStore.amount} bind:inputElement={sumInputEl}
						>Amount Sum</Input
					>
				{:else}
					<Input type="calc" disabled value={calculateAmountSum($dataStore.items)}>Amount Sum</Input
					>
				{/if}
			</div>
		{/if}
	</div>

	<div class="card filled col">
		<div class="row">
			<h3 class="headline-4">Portions</h3>
			<button
				class="btn text add"
				on:click={() => {
					$dataStore.portions = [...$dataStore.portions, { ...defaultPortion, key: uuid() }];
				}}
			>
				<IcPlus /> Add
			</button>
		</div>

		{#each $dataStore.portions as portion, index (portion.key)}
			<div class="card outlined portion">
				<button
					class="btn text"
					on:click={() => {
						$dataStore.portions.splice(index, 1);
						$dataStore = $dataStore;
					}}
				>
					<IcDelete />
				</button>
				<Input bind:value={portion.label}>Label</Input>
				<Input type="number" bind:value={portion.amount}>Amount (g||ml)</Input>
			</div>
		{/each}
	</div>
{/await}

<nav class="fab-bar">
	{#await dataStore.load() then}
		<Dialog noCloseButton let:toggle>
			<svelte:fragment slot="trigger-label">
				<IcDelete />
			</svelte:fragment>
			<div class="col">
				<h2 class="title-l">Are you sure?</h2>
				<p class="body-m">Deleting the item "{$dataStore.label}" can not be undone.</p>
				<div class="row">
					<button class="btn tonal" on:click={toggle}><IcArrowBack /> Do nothing </button>
					<button
						class="btn tonal"
						on:click={async () => {
							await Promise.all([deleteItem($dataStore.id), items.reload()]);
							toggle();
							dispatch('done', null);
						}}
					>
						<IcDelete />
						Delete
					</button>
				</div>
			</div>
		</Dialog>
	{/await}
	<button on:click={() => dispatch('done', $dataStore)}>
		<IcArrowBack />
		{#if !selector}
			Back
		{:else}
			Select
		{/if}
	</button>
</nav>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	input {
		margin: 1rem;
	}

	.portion {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		gap: 0.5rem;
	}

	.add {
		margin-left: auto;
	}

	.fab-bar {
		position: sticky;
		padding: 0;
	}
</style>
