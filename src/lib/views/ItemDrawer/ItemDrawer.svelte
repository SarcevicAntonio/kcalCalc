<script lang="ts">
	import { instantiateItem, items } from '$lib/data/items';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import IcItems from '~icons/ic/round-category';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import AddItem from './AddItem.svelte';
	import EditItem from './EditItem.svelte';
	import ItemInstanceSelector from './ItemInstanceSelector.svelte';
	import SavedItems from './SavedItems.svelte';
	const dispatch = createEventDispatcher();

	export let label = 'Items';
	export let selector = false;
	export let excludeId = '';
	export let noCustomKcal = false;
	export let isOpen = false;
	export let editId: string = null;
	export let triggerTestId = '';
</script>

<Dialog
	let:toggle
	bind:isOpen
	on:dismiss={() => {
		editId = null;
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
		{#if editId}
			<EditItem
				{selector}
				id={editId}
				on:done={async ({ detail }) => {
					if (selector && detail) {
						const itemInstance = await instantiateItem(detail);
						if (itemInstance) {
							toggle();
							dispatch('select', itemInstance);
						}
					}
					await items.reload();
					editId = null;
				}}
			/>
		{:else}
			{#if selector}
				<ItemInstanceSelector
					{noCustomKcal}
					{excludeId}
					on:externalItem={({ detail }) => {
						editId = detail.id;
					}}
					on:selectItem={async ({ detail }) => {
						const itemInstance = await instantiateItem(detail);
						if (!itemInstance) return;
						toggle();
						dispatch('select', itemInstance);
					}}
				/>
			{:else}
				<SavedItems on:select={({ detail }) => (editId = detail.id)} />
			{/if}
			<AddItem on:created={({ detail }) => (editId = detail)} />
		{/if}
	</div>
</Dialog>

<style>
	:global(.margin-left-auto) {
		margin-left: auto;
	}
</style>
