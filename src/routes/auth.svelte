<script>
	import { toISODateString } from '$lib/dateHelpers';
	import { auth } from '$lib/firebase';
	import { setUser, user } from '$lib/stores/user';
	import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import IcHome from '~icons/ic/round-home';
	import IcLogin from '~icons/ic/round-key';
	import IcLogout from '~icons/ic/round-logout';
	const provider = new GoogleAuthProvider();

	async function logout() {
		await fetch('/session', {
			method: 'DELETE',
		});
		setUser(null);
	}

	async function popAuth() {
		const result = await signInWithPopup(auth, provider);
		const token = await result.user.getIdToken();
		const user = await fetch('/session', {
			method: 'POST',
			headers: new Headers({ Authorization: 'Bearer ' + token }),
		}).then((res) => res.json());
		setUser(user);
	}
</script>

<div class="container">
	{#if !$user}
		<button class="btn tonal" on:click={popAuth}><IcLogin /> Login with Google</button>
	{:else if $user}
		<button class="btn tonal" on:click={logout}><IcLogout /> Logout</button>
		<div class="user">
			<!-- <div class="flex">
				<img src={$user.picture} alt="Your Google profile" />
				<h2>{$user.displayName}</h2>
			</div> -->
			<ul>
				<li>Email: {$user.email}</li>
				<li>id: {$user.id}</li>
			</ul>
		</div>
	{/if}
</div>

<nav>
	<a href="/day/{toISODateString(new Date())}"><IcHome /> Go Home</a>
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
