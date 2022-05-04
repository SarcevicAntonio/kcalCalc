<script>
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import IcLogin from '~icons/ic/round-key';

	async function popAuth() {
		await signInWithPopup(auth, new GoogleAuthProvider());
	}
</script>

<button class="card filled" on:click={popAuth}>
	<div class="headline-2">
		<IcLogin /> Login with Google
	</div>
</button>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}
</style>
