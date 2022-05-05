<script lang="ts">

	import { items } from '$lib/data/items';
	import { Dialog } from 'as-comps';
	import { fly } from 'svelte/transition';
	import IcItems from '~icons/ic/round-category';
import EditItem from './EditItem.svelte';
import ItemList from './ItemList.svelte';

	export let label = 'Items';

	let editId: string = null;
</script>

<Dialog
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
		<IcItems />
		{label}
	</svelte:fragment>
	<div class="flow">
		{#if !editId}
			<ItemList on:selected={({ detail }) => (editId = detail)} />
		{:else}
			<EditItem
				id={editId}
				on:done={async () => {
					await items.reload();
					editId = null;
				}}
			/>
		{/if}
	</div>
</Dialog>
