<script>
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import IcLogin from '~icons/ic/round-key';
	import IcLogout from '~icons/ic/round-logout';
	import IcHome from '~icons/ic/round-home';
	import { user } from '$lib/stores/user';
	const provider = new GoogleAuthProvider();

	function logout() {
		auth.signOut();
	}

	function popAuth() {
		signInWithPopup(auth, provider);
	}
</script>

<div class="container">
	{#if typeof $user !== 'string'}
		{#if !$user}
			<button class="btn tonal" on:click={popAuth}><IcLogin /> Login with Google</button>
		{:else if $user}
			<button class="btn tonal" on:click={logout}><IcLogout /> Logout</button>
			<div class="user">
				<div class="flex">
					<img src={$user.photoURL} alt="Your Google profile" />
					<h2>{$user.displayName}</h2>
				</div>
				<ul>
					<li>Email: {$user.email}</li>
					<li>uid: {$user.uid}</li>
				</ul>
			</div>
		{/if}
	{:else}
		loading ...
	{/if}
</div>

<nav>
	<a href="/"><IcHome /> Go Home</a>
</nav>

<style>
	.container {
		height: 60vh;
		display: grid;
		place-items: center;
		gap: 2em;
	}

	.user {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2em;
		background-color: var(--surface);
		color: var(--on-surface);
		padding: 0.5rem;
		border-radius: 1rem;
	}

	.flex {
		display: flex;
		align-items: center;
		gap: 2em;
	}

	img {
		border-radius: 1em;
	}

	ul {
		list-style: none;
		text-align: center;
		padding: 0;
	}
</style>
