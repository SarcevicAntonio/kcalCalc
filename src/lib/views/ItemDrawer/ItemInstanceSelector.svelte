<script lang="ts">
	import BarCodeScanDialog from '$lib/components/BarCodeScanDialog.svelte';
	import { createInstance } from '$lib/components/InstanceCreator';
	import ItemCards from '$lib/components/ItemCards.svelte';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import {
		customKcalAmountItem,
		customKcalCountItem,
		items,
		recentItems,
		saveExternalItem,
		type Item,
	} from '$lib/data/items';
	import { fuseItemSettings, mapItem } from '$lib/fuse';
	import Input from '$lib/Input.svelte';
	import Fuse from 'fuse.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import IcRoundAccessTime from '~icons/ic/round-access-time';
	import IcItems from '~icons/ic/round-category';
	import IcRoundNumbers from '~icons/ic/round-numbers';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import IcRoundRestore from '~icons/ic/round-restore';
	import MdiCloudSearch from '~icons/mdi/cloud-search';
	import MdiWeight from '~icons/mdi/weight';
	const dispatch = createEventDispatcher<{ externalItem: Item; selectItem: Item }>();

	export let noCustomKcal = false;
	export let excludeId = '';

	let search = '';
	/** used to skeletonize a selected external item while saving it */
	let handlingId = null;

	let externalEntries = [];
	let loadingExternalItems = false;
	async function searchExternal() {
		externalEntries = [];
		loadingExternalItems = true;
		externalEntries = await fetch('/search/' + encodeURIComponent(search)).then((r) => r.json());
		loadingExternalItems = false;
	}

	function resetExternal() {
		externalEntries = [];
		loadingExternalItems = false;
	}

	async function handleSelect({ detail: item }: { detail: Item }) {
		// is this item external?
		if (externalEntries.length) {
			handlingId = item.id;
			const cleanedItem = await saveExternalItem(item);
			search = '';
			handlingId = null;
			dispatch('externalItem', cleanedItem);
		} else {
			const itemInstance = await createInstance(item);
			if (!itemInstance) return;
			search = '';
			dispatch('selectItem', itemInstance);
		}
	}

	let inputElement: HTMLInputElement;

	onMount(() => {
		inputElement.focus();
	});
</script>

<h2 class="headline-3 with-icon">
	<IcRoundPlaylistAdd /> Track Item
</h2>
<div class="row">
	<Input clearable bind:inputElement bind:value={search} on:input={resetExternal}
		>Search
		<svelte:fragment slot="inline">
			{#if !search}
				<BarCodeScanDialog on:scanned={({ detail: code }) => (search = code)} />
			{/if}
		</svelte:fragment>
	</Input>
</div>
{#if search}
	{#if externalEntries.length || loadingExternalItems}
		<button class="btn tonal w100p" on:click={resetExternal}>
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

{#if !externalEntries.length && !search}
	<p class="recent-items-title"><IcRoundAccessTime /> Recent Items:</p>
{/if}

{#if !loadingExternalItems}
	<ItemCards
		skeletonId={handlingId}
		{excludeId}
		items={externalEntries.length
			? externalEntries
			: search
			? new Fuse($items, fuseItemSettings).search(search).map(mapItem).splice(0, 50)
			: $recentItems}
		on:select={handleSelect}
	>
		{#if externalEntries.length}
			<MdiCloudSearch />
		{:else if search}
			<IcItems />
		{:else}
			<IcRoundRestore />
		{/if}

		No {externalEntries.length ? 'external' : search ? 'saved' : 'recently used'} items found
	</ItemCards>
{:else}
	{#each { length: 10 } as _}
		<ItemSkeleton />
	{/each}
{/if}

<style>
	.w100p {
		width: 100%;
		justify-content: flex-start;
	}

	.recent-items-title {
		display: flex;
		align-items: center;
		gap: 0.25em;
		color: var(--md-on-surface);
	}

	.row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
</style>
