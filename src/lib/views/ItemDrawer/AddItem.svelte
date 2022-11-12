<script lang="ts">
	import { createItem, type Item } from '$lib/data/items';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcAdd from '~icons/ic/round-add';

	const dispatch = createEventDispatcher<{ created: Item }>();
	let loading = false;
</script>

<button
	class:skeleton={loading}
	on:click={async () => {
		loading = true;
		const id = uuid();
		const item = createItem(id);
		dispatch('created', item);
		loading = false;
	}}
>
	<IcAdd /> New Item
</button>

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
