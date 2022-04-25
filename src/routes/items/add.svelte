<script>
	import { db } from '$lib/firebase';
	import { v4 as uuid } from 'uuid';
	import { doc, setDoc } from 'firebase/firestore';
	import { defaultItem } from '$lib/stores/items';
	import { goto } from '$app/navigation';

	async function newItem() {
		const id = uuid();
		await setDoc(doc(db, 'Items/' + id), { ...defaultItem, id });
		goto('/items/edit/' + id);
	}

	newItem();
</script>
