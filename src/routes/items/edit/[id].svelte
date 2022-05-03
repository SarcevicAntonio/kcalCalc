<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ItemInstance from '$lib/components/ItemInstance.svelte';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import { db } from '$lib/firebase';
	import Input from '$lib/Input.svelte';
	import { calculateAmountSum, calculateKcalPer100FromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import {
		createItemStore,
		defaultPortion,
		items,
		type Item,
		type ItemInstance as ItemInstanceType,
	} from '$lib/stores/items';
	import type { WritableLoadable } from '@square/svelte-store';
	import { Dialog } from 'as-comps';
	import { deleteDoc, doc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPlus from '~icons/ic/round-plus';

	export let dataStore: WritableLoadable<Item> = createItemStore($page.params.id);

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
	<Input disabled>Brand</Input>
	<Input disabled>kcal per 100 g || ml</Input>

	{#each { length: 2 } as _}
		<ItemSkeleton>
			<div class="row">
				<h3 class="headline-4">Portions</h3>
				<button class="btn text add" />
			</div>
		</ItemSkeleton>
	{/each}
{:then}
	<Input bind:value={$dataStore.label}>Label</Input>

	<Input bind:value={$dataStore.brand}>Brand</Input>

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
			<ItemSelector
				noCustomKcal
				end
				excludeId={$page.params.id}
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

<nav>
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
							await Promise.all([deleteDoc(doc(db, `Items/${$dataStore.id}`)), items.reload()]);
							toggle();
							goto('/items');
						}}
					>
						<IcDelete />
						Delete
					</button>
				</div>
			</div>
		</Dialog>
	{/await}
	<a sveltekit:prefetch href="/items" on:click={() => items.reload()}><IcArrowBack /> Back</a>
</nav>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5em;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	input {
		margin: 1em;
	}

	.portion {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5em;
		gap: 0.5em;
	}

	.add {
		margin-left: auto;
	}
</style>
