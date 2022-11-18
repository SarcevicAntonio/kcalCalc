<script lang="ts">
	import { createInstance } from '$lib/components/InstanceCreator'
	import type { Item } from '$lib/data/items'
	import { Dialog } from 'as-comps'
	import { createEventDispatcher } from 'svelte'
	import { fly } from 'svelte/transition'
	import IcArrowBack from '~icons/ic/round-arrow-back'
	import IcItems from '~icons/ic/round-category'
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add'
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt'
	import AddItem from './AddItem.svelte'
	import EditItem from './EditItem.svelte'
	import ItemInstanceSelector from './ItemInstanceSelector.svelte'
	import QuickSnacks from './QuickSnacks.svelte'
	import SavedItems from './SavedItems.svelte'

	const dispatch = createEventDispatcher()

	export let label = 'Items'
	export let selector = false
	export let excludeId = ''
	export let noCustomKcal = false
	export let isOpen = false
	export let editItem: Item = null
	export let triggerTestId = ''
	let showQuickSnacks = false
</script>

<Dialog
	let:toggle
	bind:isOpen
	on:dismiss={() => {
		editItem = null
		showQuickSnacks = false
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
						const itemInstance = await createInstance(detail)
						if (itemInstance) {
							toggle()
							dispatch('select', itemInstance)
						}
					}
					editItem = null
				}}
			/>
		{:else if selector}
			<ItemInstanceSelector
				{noCustomKcal}
				{excludeId}
				on:edit={({ detail: item }) => (editItem = item)}
				on:selectItem={({ detail: itemInstance }) => {
					toggle()
					dispatch('select', itemInstance)
				}}
			/>
		{:else}
			<SavedItems on:edit={({ detail }) => (editItem = detail)} />
		{/if}
	</div>
</Dialog>

<style>
	:global(.margin-left-auto) {
		margin-left: auto;
	}
</style>
