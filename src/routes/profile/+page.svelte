<script>
	import { goto } from '$app/navigation'
	import { user, userSettings } from '$lib/data/user'
	import { auth } from '$lib/firebase'
	import Input from '$lib/Input.svelte'
	import { signOut } from 'firebase/auth'
	import IcHome from '~icons/ic/round-home'
	import IcLogout from '~icons/ic/round-logout'

	async function logout() {
		await signOut(auth)
		goto('/')
	}

	let imgError = false
</script>

<div class="container">
	{#if $user}
		<span class="title-l">Howdy, good lookin'!</span>
		<div class="user">
			<span class="headline-2">{$user.displayName}</span>
			{#if !imgError}
				<img
					src={$user.photoURL}
					alt="Your Profile"
					on:error={() => {
						imgError = true
					}}
				/>
			{/if}
			<ul>
				<li>Email: {$user.email}</li>
				<li>id: {$user.id}</li>
			</ul>
			<hr />
			{#await userSettings.load()}
				<Input type="calc" disabled>Kcal Goal</Input>
				<Input type="calc" disabled>Protein Goal</Input>
			{:then}
				<Input type="calc" bind:value={$userSettings.kcalLimit}>
					Kcal Goal
				</Input>
				<Input type="calc" bind:value={$userSettings.proteinLimit}>
					Protein Goal
				</Input>
			{/await}
			<a
				href="https://www.tk.de/service/app/2004134/kalorienrechner/einstieg.app?tkcm=ab"
				target="_blank"
				rel="noreferrer"
			>
				Kalorienbedarfsrechner von TK
			</a>
		</div>
		<button class="btn tonal" on:click={logout}>
			<IcLogout /> Logout
		</button>
	{/if}
</div>

{#if $user}
	<nav class="fab-bar">
		<a href="/">
			<IcHome /> Go Home
		</a>
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

	a {
		color: var(--md-primary);
	}
</style>
