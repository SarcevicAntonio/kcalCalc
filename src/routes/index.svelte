<script lang="ts">
	import { user } from '$lib/stores/user';
	import IconHome from '~icons/mdi/home';
	import IconLogin from '~icons/mdi/login-variant';
	// import { db } from '$lib/firebase';
	// import { day } from './day/_data';

	// async function read() {
	// 	const collectionRef: CollectionReference<DocumentData> = collection(
	// 		db,
	// 		'Users/1/Years/2022/Weeks/41/Days'
	// 	);
	// 	const docsRefs: QuerySnapshot<DocumentData> = await getDocs(collectionRef);

	// 	docsRefs.docs.forEach((doc) => {
	// 		console.log(doc.id, doc.data());
	// 	});

	// 	const docRef = doc(db, 'Users/1/Years/2022/Weeks/41/Days/2022-10-15');
	// 	const docSnap = await getDoc(docRef);

	// 	console.log(docSnap.id, docSnap.data());
	// }

	// async function update() {
	// 	setDoc(doc(db, 'Users/1/Years/2022/Weeks/41/Days/2022-10-15'), day);
	// }
</script>

<a href="/day/xyz"> Go to new day view </a>

<a href="/items"> Go to new item view </a>

{#if !$user}
	<p>You need to Login to use kcalCalc</p>
{/if}

<!-- <button class="btn tonal" on:click={read}> Read </button>

	<button class="btn tonal" on:click={update}> Update </button> -->

<nav>
	{#if !$user}
		<a href="/auth"><IconLogin />Login</a>
	{:else}
		<a href="/day/xxx"><IconHome />Heute</a>
	{/if}
</nav>

<style>
</style>
