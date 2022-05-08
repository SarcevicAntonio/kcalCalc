<script lang="ts">
	import { instantiateItem, items } from '$lib/data/items';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import IcItems from '~icons/ic/round-category';
	import IcAdd from '~icons/ic/round-plus';
	import AddItem from './AddItem.svelte';
	import EditItem from './EditItem.svelte';
	import ItemInstanceSelector from './ItemInstanceSelector.svelte';
	import SavedItems from './SavedItems.svelte';
	const dispatch = createEventDispatcher();

	export let label = 'Items';
	export let selector = false;
	export let excludeId = '';
	export let noCustomKcal = false;
	export let triggerClass = '';

	let editId: string = null;
</script>

<Dialog
	let:toggle
	triggerClass="margin-left-auto {selector ? 'btn text' : ''} {triggerClass}"
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
			<IcAdd />
			Add Item
		{/if}
	</svelte:fragment>
	<div class="flow">
		{#if editId}
			<EditItem
				{selector}
				id={editId}
				on:done={async ({ detail }) => {
					if (selector && detail) {
						const itemInstance = instantiateItem(detail);
						toggle();
						dispatch('select', itemInstance);
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
					on:select={({ detail }) => {
						toggle();
						dispatch('select', detail);
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