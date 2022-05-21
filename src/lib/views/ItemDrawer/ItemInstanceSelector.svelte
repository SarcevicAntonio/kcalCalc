<script lang="ts">
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import {
		customKcalAmountItem,
		customKcalCountItem,
		instantiateItem,
		items,
		recentItems,
		saveExternalItem,
		type Item,
	} from '$lib/data/items';
	import Input from '$lib/Input.svelte';
	import Fuse from 'fuse.js';
	import { createEventDispatcher } from 'svelte';
	import IcItems from '~icons/ic/round-category';
	import IcRoundNumbers from '~icons/ic/round-numbers';
	import MdiCloudSearch from '~icons/mdi/cloud-search';
	import MdiWeight from '~icons/mdi/weight';
	import IcArrowBack from '~icons/ic/round-arrow-back';
	const dispatch = createEventDispatcher();

	export let noCustomKcal = false;
	export let excludeId = '';

	let search = '';
	let handlingId = null;

	let externalEntries = [];
	let loadingExternalItems = false;
	async function searchExternal() {
		externalEntries = [];
		loadingExternalItems = true;
		externalEntries = await (await fetch('/search/' + encodeURIComponent(search))).json();
		loadingExternalItems = false;
	}

	async function handleSelect({ detail: item }: { detail: Item }) {
		const itemInstance = instantiateItem(item);
		if (externalEntries.length) {
			handlingId = item.id;
			await saveExternalItem(item);
			dispatch('externalItem', item);
			handlingId = null;
			search = '';
			return;
		}
		search = '';
		dispatch('select', itemInstance);
	}
</script>

<h2 class="headline-3">Add Item</h2>
<Input
	clearable
	bind:value={search}
	on:input={() => {
		externalEntries = [];
	}}>Search</Input
>
{#if search}
	{#if externalEntries.length || loadingExternalItems}
		<button class="btn tonal w100p" on:click={() => (externalEntries = [])}>
			<IcItems /> Back to saved items
		</button>
	{:else}
		<button class="btn tonal w100p" on:click={searchExternal}>
			<MdiCloudSearch /> Search for item on internet
		</button>
	{/if}
{:else}
	{#if !noCustomKcal}
		<button
			class="btn tonal w100p"
			on:click={() => {
				handleSelect({ detail: customKcalCountItem });
			}}
		>
			<IcRoundNumbers /> Custom kcal count
		</button>
	{/if}
	<button
		class="btn tonal w100p"
		on:click={() => {
			handleSelect({ detail: customKcalAmountItem });
		}}
	>
		<MdiWeight /> Custom kcal & amount
	</button>
{/if}

{#await recentItems.load()}
	{#each { length: 10 } as _}
		<ItemSkeleton />
	{/each}
{:then}
	{#if !loadingExternalItems}
		<ItemCards
			skeletonId={handlingId}
			dontShowSkeletons
			{excludeId}
			items={externalEntries.length
				? externalEntries
				: search
				? new Fuse($items, { keys: ['label', 'brand'] }).search(search).map((res) => res.item)
				: $recentItems}
			on:select={handleSelect}
		/>
	{:else}
		{#each { length: 10 } as _}
			<ItemSkeleton />
		{/each}
	{/if}
{/await}

<style>
	.w100p {
		width: 100%;
		justify-content: flex-start;
	}
</style>
