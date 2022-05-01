<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import ItemInstance from '$lib/components/ItemInstance.svelte';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import { db } from '$lib/firebase';
	import Input from '$lib/Input.svelte';
	import { calculateAmountSum, calculateKcalPer100FromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import {
		defaultItem,
		defaultPortion,
		type Item,
		type ItemInstance as ItemInstanceType,
	} from '$lib/stores/items';
	import { user } from '$lib/stores/user';
	import { Dialog } from 'as-comps';
	import { deleteDoc, doc, setDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPlus from '~icons/ic/round-plus';

	export let data: Item = defaultItem;

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

	const docRef = doc(db, `Items/${$page.params.id}`);

	async function updateData(newData: Item) {
		if (!browser || !$user || $navigating) return;

		await setDoc(docRef, newData);
	}

	$: updateData(data);

	async function addItem(newItem: ItemInstanceType) {
		data.kcalPer100 = 0;
		data.items = [...data.items, newItem];
	}
</script>

<h2 class="headline-1">Edit Item</h2>

<Input bind:value={data.label}>Label</Input>

<Input bind:value={data.brand}>Brand</Input>

{#if !data.items.length}
	<Input type="calc" bind:value={data.kcalPer100}>kcal per 100 g || ml</Input>
{:else}
	<Input
		type="calc"
		disabled
		value={kcalDisplay(calculateKcalPer100FromItems(data.items, data.amount))}
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
	{#each data.items as child, index}
		<ItemInstance
			bind:item={child}
			on:delete={() => {
				data.items.splice(index, 1);
				if (!data.items.length) data.kcalPer100 = 100;
				data = data;
			}}
		/>
	{/each}
	{#if data.items.length}
		<div class="row">
			<input
				aria-label="Override Amount"
				id="override-amount"
				type="checkbox"
				checked={data.amount ? true : false}
				on:input={() => {
					if (data.amount) {
						data.amount = 0;
					} else {
						data.amount = calculateAmountSum(data.items) || 100;
					}
				}}
			/>
			{#if data.amount || activeEl === sumInputEl}
				<Input type="calc" bind:value={data.amount} bind:inputElement={sumInputEl}>Amount Sum</Input
				>
			{:else}
				<Input type="calc" disabled value={calculateAmountSum(data.items)}>Amount Sum</Input>
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
				data.portions = [...data.portions, { ...defaultPortion, key: uuid() }];
			}}
		>
			<IcPlus /> Add
		</button>
	</div>

	{#each data.portions as portion, index (portion.key)}
		<div class="card outlined portion">
			<button
				class="btn text"
				on:click={() => {
					data.portions.splice(index, 1);
					data = data;
				}}
			>
				<IcDelete />
			</button>
			<Input bind:value={portion.label}>Label</Input>
			<Input type="number" bind:value={portion.amount}>Amount (g||ml)</Input>
		</div>
	{/each}
</div>

<nav>
	<Dialog noCloseButton let:toggle>
		<svelte:fragment slot="trigger-label">
			<IcDelete />
		</svelte:fragment>
		<div class="col">
			<h2 class="title-l">Are you sure?</h2>
			<p class="body-m">Deleting the item "{data.label}" can not be undone.</p>
			<div class="row">
				<button class="btn tonal" on:click={toggle}><IcArrowBack /> Do nothing </button>
				<button
					class="btn tonal"
					on:click={async () => {
						await deleteDoc(docRef);
						goto('/items');
						toggle();
					}}
				>
					<IcDelete />
					Delete
				</button>
			</div>
		</div>
	</Dialog>
	<a sveltekit:prefetch href="/items"><IcArrowBack /> Back</a>
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
