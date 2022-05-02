<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { calculateKcalPer100FromItems } from '$lib/kcal';
	import {
		customKcalAmountItem,
		customKcalCountItem,
		items,
		recentItems,
		saveExternalItem,
		setRecentItem,
		type Item,
		type ItemInstance,
	} from '$lib/stores/items';
	import { loadAll } from '@square/svelte-store';
	import { Dialog } from 'as-comps';
	import Fuse from 'fuse.js';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { v4 as uuid } from 'uuid';
	import IcItems from '~icons/ic/round-category';
	import IcPlus from '~icons/ic/round-plus';
	import IcEdit from '~icons/ic/round-swap-horiz';
	import MdiCloudSearch from '~icons/mdi/cloud-search';
	import ItemCard from './ItemCard.svelte';
	import ItemSkeleton from './ItemSkeleton.svelte';

	enum status {
		recents,
		search,
		external,
	}

	const dispatch = createEventDispatcher();
	export let edit = false;
	export let end = false;
	export let tonal = false;
	export let noCustomKcal = false;
	export let excludeId = '';

	let activeStatus = status.recents;
	let search = '';

	let dialogOpen = false;
	async function toggle() {
		dialogOpen = !dialogOpen;
	}

	let externalEntries = [];
	async function searchExternal() {
		externalEntries = [];
		activeStatus = status.external;
		externalEntries = await (await fetch('/search/' + encodeURIComponent(search))).json();
	}

	function selectItem(item: Item) {
		if (!item.id.startsWith('CUSTOM')) setRecentItem(item);
		const itemInstance: ItemInstance = {
			key: uuid(),
			id: item.id,
			label: item.label,
			brand: item.brand || '',
			kcalPer100: item.kcalPer100 || calculateKcalPer100FromItems(item.items, item.amount),
			amount: 100,
			portions: item.portions || [],
		};
		dispatch('select', itemInstance);
		dialogOpen = false;

		search = '';
		activeStatus = status.recents;
	}
</script>

<button class:end class="btn {tonal ? 'tonal' : 'text'}" on:click|stopPropagation={toggle}>
	{#if edit}
		<IcEdit />
	{:else}
		<IcPlus /> Add
	{/if}
</button>
<Dialog
	dialogIn={fly}
	transitionOptions={{ x: 500 }}
	dialogOut={fly}
	--as-dialog-left="auto"
	--as-dialog-right="0"
	--as-dialog-transform="translateY(-50%)"
	--as-dialog-border-radius="0"
	--as-dialog-width="100%"
	--as-dialog-max-width="800px"
	--as-dialog-height="100%"
	--as-dialog-max-height="100%"
	bind:open={dialogOpen}
	includedTrigger={false}
>
	<svelte:fragment slot="trigger-label" />
	<div class="content">
		<h2 class="title-l">Select Item</h2>
		<div class="row">
			<Input
				bind:value={search}
				on:input={async () => {
					if (search) {
						activeStatus = status.search;
					} else {
						activeStatus = status.recents;
					}
				}}
			>
				Search
			</Input>
			{#if activeStatus !== status.external}
				<button class="btn text" disabled={!search} on:click={searchExternal}>
					<MdiCloudSearch />
				</button>
			{:else}
				<button
					class="btn text"
					on:click={() => {
						activeStatus = status.search;
						externalEntries = [];
					}}
				>
					<IcItems />
				</button>
			{/if}
		</div>

		{#await loadAll([items, recentItems])}
			{#each { length: 10 } as _}
				<ItemSkeleton />
			{/each}
		{:then}
			{#if activeStatus === status.recents}
				{#if !noCustomKcal}
					<button
						on:click={() => {
							selectItem(customKcalCountItem);
						}}
						class="card filled"
					>
						<span class="title-l">Custom kcal count</span>
					</button>
				{/if}
				<button
					on:click={() => {
						selectItem(customKcalAmountItem);
					}}
					class="card filled"
				>
					<span class="title-l">Custom kcal & amount</span>
				</button>
				{#each $recentItems as item}
					{#if item.id !== excludeId}
						<button on:click={() => selectItem(item)}>
							<ItemCard {item} />
						</button>
					{/if}
				{/each}
			{:else if activeStatus === status.search}
				{#each new Fuse($items, { keys: ['label', 'brand'] })
					.search(search + '')
					.map((res) => res.item) as item}
					{#if item.id !== excludeId}
						<button on:click={() => selectItem(item)}>
							<ItemCard {item} />
						</button>
					{/if}
				{/each}
			{:else if activeStatus === status.external}
				{#each externalEntries as item}
					<button
						on:click={() => {
							saveExternalItem(item);
							selectItem(item);
						}}
					>
						<ItemCard {item} />
					</button>
				{/each}
			{/if}
		{/await}
	</div>
</Dialog>

<style>
	.row {
		display: flex;
	}
	.end {
		margin-left: auto;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;

		min-width: 277px;
	}
</style>
