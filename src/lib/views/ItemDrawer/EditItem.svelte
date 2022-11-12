<script lang="ts">
	import BarCodeScanDialog from '$lib/components/BarCodeScanDialog.svelte';
	import ItemInstance from '$lib/components/ItemInstanceEditor.svelte';
	import TrackNow from '$lib/components/TrackNow.svelte';
	import {
		createItemStore,
		defaultPortion,
		deleteItem,
		items,
		type Item,
		type ItemInstance as ItemInstanceType,
	} from '$lib/data/items';
	import { toISODateString } from '$lib/dateHelpers';
	import Input from '$lib/Input.svelte';
	import { calculateAmountSum, calculateKcalPer100FromItems, kcalDisplay } from '$lib/kcal';
	import { shareItem } from '$lib/share';
	import type { WritableLoadable } from '@square/svelte-store';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher, onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcRoundEdit from '~icons/ic/round-edit';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import IcAdd from '~icons/ic/round-plus';
	import IcRoundShare from '~icons/ic/round-share';
	import IcRoundToday from '~icons/ic/round-today';
	import ItemDrawer from './ItemDrawer.svelte';
	import PortionCreator from './PortionCreator.svelte';
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt';
	import MaterialSymbolsOfflineBoltOutline from '~icons/material-symbols/offline-bolt-outline';
	import { addQuickSnack, quickSnacks, removeQuickSnack } from '$lib/data/quickSnacks';

	const dispatch = createEventDispatcher();

	export let item: Item;
	export let selector = false;

	let dataStore: WritableLoadable<Item> = createItemStore(item);
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

<h2 class="headline-3 with-icon">
	{#if !selector}
		<IcRoundEdit />Edit Item
	{:else}
		<IcRoundPlaylistAdd /> Track Item
	{/if}
</h2>

<Input bind:value={$dataStore.label}>Label</Input>
<Input bind:value={$dataStore.brand}>
	Brand / Date / Whatever
	<svelte:fragment slot="inline">
		{#if !$dataStore.brand}
			<button
				class="inline-btn"
				data-testid="set-date-as-brand"
				on:click={() => {
					$dataStore.brand = toISODateString(new Date());
				}}
			>
				<IcRoundToday />
			</button>
		{/if}
	</svelte:fragment>
</Input>

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
<Input type="number" bind:value={$dataStore.ean}
	>EAN (Barcode)
	<svelte:fragment slot="inline">
		<BarCodeScanDialog on:scanned={({ detail: code }) => ($dataStore.ean = code)} />
	</svelte:fragment>
</Input>

<div class="card filled col">
	<div class="row">
		<h3 class="headline-4">Items</h3>
		<ItemDrawer
			selector
			noCustomKcal
			excludeId={item.id}
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
		<div class="row margin-top">
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
				<Input type="calc" bind:value={$dataStore.amount} bind:inputElement={sumInputEl}>
					Amount Sum
				</Input>
			{:else}
				<Input type="calc" disabled value={calculateAmountSum($dataStore.items)}>Amount Sum</Input>
			{/if}
			<PortionCreator
				amount={$dataStore.amount || calculateAmountSum($dataStore.items)}
				on:create={({ detail: portion }) => {
					$dataStore.portions = [...$dataStore.portions, { ...portion, key: uuid() }];
				}}
			/>
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
			<IcAdd /> Add Portion
		</button>
	</div>

	{#each $dataStore.portions as portion, index (portion.key)}
		<div class="card outlined portion col">
			<div class="row">
				<Input bind:value={portion.label}>Label</Input>
				{#if $quickSnacks[$dataStore.id]?.some((pk) => pk === portion.key)}
					<button
						class="btn text"
						on:click={() => {
							removeQuickSnack($dataStore.id, portion.key);
						}}
					>
						<MaterialSymbolsOfflineBolt />
					</button>
				{:else}
					<button
						class="btn text"
						on:click={() => {
							addQuickSnack($dataStore.id, portion.key);
						}}
					>
						<MaterialSymbolsOfflineBoltOutline />
					</button>
				{/if}
			</div>
			<div class="row">
				<Input type="calc" bind:value={portion.amount}>Amount (g||ml)</Input>
				<button
					class="btn text"
					on:click={() => {
						$dataStore.portions.splice(index, 1);
						$dataStore = $dataStore;
					}}
				>
					<IcDelete />
				</button>
			</div>
		</div>
	{/each}
</div>

<nav class="fab-bar">
	<!-- hotfix for dialog destory error "Cannot read properties of null (reading 'removeChild')" -->
	<Dialog noCloseButton let:toggle dialogOut={() => null} backdropOut={() => null}>
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
						await deleteItem($dataStore.id);
						dispatch('done', null);
					}}
				>
					<IcDelete />
					Delete
				</button>
			</div>
		</div>
	</Dialog>
	<button
		on:click={() => {
			shareItem($dataStore);
		}}
	>
		<IcRoundShare />
	</button>
	{#if !selector}
		<TrackNow item={$dataStore} />
	{/if}
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
		gap: 0.25rem;
	}

	input {
		margin: 1rem;
	}

	.portion {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
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

	.margin-top {
		margin-top: 0.25em;
	}
</style>
