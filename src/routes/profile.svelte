<script>
	import UserSettings from '$lib/components/UserSettings.svelte';
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/user';
	import { signOut } from 'firebase/auth';
	import IcHome from '~icons/ic/round-home';
	import IcLogout from '~icons/ic/round-logout';

	async function logout() {
		await signOut(auth);
	}
</script>

<div class="container">
	{#if $user}
		<span class="title-l">Howdy, good lookin'!</span>
		<div class="user">
			<span class="headline-2">{$user.displayName}</span>
			<img src={$user.photoURL} alt="Your Profile" />
			<ul>
				<li>Email: {$user.email}</li>
				<li>id: {$user.id}</li>
			</ul>
			<hr />
			<UserSettings />
		</div>
		<button class="btn tonal" on:click={logout}><IcLogout /> Logout</button>
	{/if}
</div>

{#if $user}
	<nav class="fab-bar">
		<a sveltekit:prefetch href="/"><IcHome /> Go Home</a>
	</nav>
{/if}

<style>
	.container {
		height: 80vh;
		display: grid;
		place-items: center;
		gap: 2rem;
	}

	.user {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		background-color: var(--surface);
		color: var(--on-surface);
		padding: 1rem;
		border-radius: 0.75rem;
		border: 1px solid var(--md-outline);
		box-shadow: var(--shadow-lg);
	}

	ul {
		list-style: none;
		text-align: center;
		padding: 0;
	}

	hr {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--md-outline);
	}

	img {
		border-radius: 0.75rem;
	}
</style>
