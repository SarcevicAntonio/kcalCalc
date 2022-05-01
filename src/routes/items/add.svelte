<script>
	import { goto } from '$app/navigation';
	import { db } from '$lib/firebase';
	import { defaultItem } from '$lib/stores/items';
	import { user } from '$lib/stores/user';
	import { doc, setDoc } from 'firebase/firestore';
	import { v4 as uuid } from 'uuid';

	async function newItem() {
		const id = uuid();
		await setDoc(doc(db, 'Items/' + id), { ...defaultItem, id, owner: $user.id });
		goto('/items/edit/' + id);
	}

	newItem();
</script>

<h2 class="headline-1">Adding new item...</h2>
