<script lang="ts">
	import { createItem } from '$lib/data/items';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuid } from 'uuid';
	import IcAdd from '~icons/ic/round-add';

	const dispatch = createEventDispatcher<{ created: string }>();
</script>

<nav class="fab-bar">
	<button
		on:click={async () => {
			const id = uuid();
			await createItem(id);
			dispatch('created', id);
		}}
	>
		<IcAdd /> Add
	</button>
</nav>

<style>
	.fab-bar {
		position: sticky;
		padding: 0;
	}
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
