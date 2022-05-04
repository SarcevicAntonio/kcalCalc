<script>
	import { goto } from '$app/navigation';
	import { createItem } from '$lib/stores/items';
	import { v4 as uuid } from 'uuid';

	async function newItem() {
		const id = uuid();
		await createItem(id);
		goto('/items/edit/' + id);
	}

	newItem();
</script>

<h2 class="headline-1">Adding new item...</h2>
