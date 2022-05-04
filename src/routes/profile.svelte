<script>
	import UserSettings from '$lib/components/UserSettings.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { auth } from '$lib/firebase';
	import { user } from '$lib/stores/user';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import IcHome from '~icons/ic/round-home';
	import IcLogout from '~icons/ic/round-logout';

	async function logout() {
		await signOut(auth);
	}
</script>

<div class="container">
	{#if $user}
		<div class="user">
			<h2>{$user.displayName}</h2>
			<img src={$user.photoURL} alt="Your Profile" />
			<ul>
				<li>Email: {$user.email}</li>
				<li>id: {$user.id}</li>
			</ul>
		</div>
		<UserSettings />
		<button class="btn tonal" on:click={logout}><IcLogout /> Logout</button>
	{/if}
</div>

{#if $user}
	<nav>
		<a sveltekit:prefetch href="/day/{toISODateString(new Date())}"><IcHome /> Go Home</a>
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
		padding: 0.5rem;
		border-radius: 1rem;
	}

	ul {
		list-style: none;
		text-align: center;
		padding: 0;
	}
</style>
