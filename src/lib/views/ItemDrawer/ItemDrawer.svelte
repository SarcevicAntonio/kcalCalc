<script lang="ts">
	import { createInstance } from '$lib/components/InstanceCreator';
	import type { Item } from '$lib/data/items';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import IcItems from '~icons/ic/round-category';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import AddItem from './AddItem.svelte';
	import EditItem from './EditItem.svelte';
	import ItemInstanceSelector from './ItemInstanceSelector.svelte';
	import SavedItems from './SavedItems.svelte';
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt';
	import IcArrowBack from '~icons/ic/round-arrow-back';

	const dispatch = createEventDispatcher();

	export let label = 'Items';
	export let selector = false;
	export let excludeId = '';
	export let noCustomKcal = false;
	export let isOpen = false;
	export let editItem: Item = null;
	export let triggerTestId = '';
	let showQuickSnacks = false;
</script>

<Dialog
	let:toggle
	bind:isOpen
	on:dismiss={() => {
		editItem = null;
	}}
	triggerProps={{
		class: `margin-left-auto ${selector ? 'btn text' : ''}`,
		'data-testid': triggerTestId,
	}}
	data-testid="item-drawer"
	dialogIn={fly}
	transitionOptions={{ x: 500 }}
	dialogOut={fly}
	--as-dialog-left="auto"
	--as-dialog-right="0"
	--as-dialog-transform="translateY(-50%)"
	--as-dialog-border-radius="0"
	--as-dialog-width="100%"
	--as-dialog-max-width="400px"
	--as-dialog-height="100%"
	--as-dialog-max-height="100%"
>
	<svelte:fragment slot="trigger-label">
		{#if !selector}
			<IcItems />
			{label}
		{:else}
			<IcRoundPlaylistAdd />
			Track Item
		{/if}
	</svelte:fragment>
	<div class="flow">
		{#if editItem}
			<EditItem
				{selector}
				item={editItem}
				on:done={async ({ detail }) => {
					if (selector && detail) {
						const itemInstance = await createInstance(detail);
						if (itemInstance) {
							toggle();
							dispatch('select', itemInstance);
						}
					}
					editItem = null;
				}}
			/>
		{:else}
			{#if selector}
				<ItemInstanceSelector
					{noCustomKcal}
					{excludeId}
					on:externalItem={({ detail }) => {
						editItem = detail;
					}}
					on:selectItem={async ({ detail: itemInstance }) => {
						toggle();
						dispatch('select', itemInstance);
					}}
				/>
			{:else if !showQuickSnacks}
				<SavedItems on:select={({ detail }) => (editItem = detail)} />
			{:else}
				QuickSnacks
			{/if}
			<nav class="fab-bar">
				{#if selector}
					&nbsp;
				{:else}
					<button on:click={() => (showQuickSnacks = !showQuickSnacks)}>
						{#if !showQuickSnacks}
							<MaterialSymbolsOfflineBolt />
						{:else}
							<IcArrowBack />
						{/if}
					</button>
				{/if}
				<AddItem on:created={({ detail }) => (editItem = detail)} />
			</nav>
		{/if}
	</div>
</Dialog>

<style>
	:global(.margin-left-auto) {
		margin-left: auto;
	}
	.fab-bar {
		position: sticky;
		padding: 0;
	}
</style>
