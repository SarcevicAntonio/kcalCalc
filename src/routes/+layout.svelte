<script lang="ts">
	import { browser } from '$app/environment'
	import { items, recentItems } from '$lib/data/items'
	import { quickSnacks } from '$lib/data/quickSnacks'
	import { user } from '$lib/data/user'
	import { auth } from '$lib/firebase'
	import Login from '$lib/views/Login.svelte'
	import { Notifications } from 'as-comps'
	import IconProfile from '~icons/ic/round-account-circle'
	import IcRoundCloudOff from '~icons/ic/round-cloud-off'
	import LineMdLoadingTwotoneLoop from '~icons/line-md/loading-twotone-loop'
	import '../css/global.css'
	import Credits from './Credits.svelte'

	let authStateUnfetched = true

	auth.onAuthStateChanged((changedUser) => {
		authStateUnfetched = false
		if (!changedUser) {
			$user = null
			return
		}

		const { displayName, email, uid, photoURL } = changedUser
		$user = {
			id: uid,
			email,
			displayName,
			photoURL,
		}

		// preload data
		items.load()
		recentItems.load()
		quickSnacks.load()
	})

	let imgError = false

	let offline: boolean = browser ? !navigator.onLine : false
	const updateOfflineStatus = () => (offline = !navigator.onLine)

	let creditsOpen = false
</script>

<svelte:window
	on:online={updateOfflineStatus}
	on:offline={updateOfflineStatus}
/>

<header>
	<button on:click={() => (creditsOpen = true)}>
		<img src="/icon-mono.svg" alt="kcalCalc Logo" />
		<h1>kcalCalc</h1>
	</button>

	<div class="header-items">
		{#if offline}
			<IcRoundCloudOff color="var(--md-error)" />
		{/if}
		{#if $user}
			<a data-sveltekit-prefetch class="btn text" href="/profile">
				{#if $user.photoURL && !imgError}
					<img
						src={$user.photoURL}
						alt="You"
						class="profile-img"
						on:error={() => (imgError = true)}
					/>
				{:else}
					<IconProfile />
				{/if}
			</a>
		{/if}
	</div>
</header>

<main class="flow">
	{#if authStateUnfetched}
		<div class="loading">
			<LineMdLoadingTwotoneLoop />
		</div>
	{:else if !$user}
		<Login />
	{:else}
		<slot />
	{/if}
</main>

<Credits bind:isOpen={creditsOpen} />

<Notifications
	--as-notification-color="var(--md-on-surface)"
	--as-notification--info-background="var(--md-surface)"
	--as-notification--info-border-color="var(--md-surface)"
	--as-notification--btn-background="var(--md-primary-container)"
	--as-notification--warn-color="var(--md-surface)"
/>

<style lang="postcss">
	h1 {
		font-weight: 400;
		font-size: 36px;
		line-height: 44px;
		font-weight: bold;
	}

	img {
		height: auto;
		width: auto;
	}

	header {
		display: flex;
		justify-content: space-between;
		padding-block: 0.25rem;
		padding-left: 0.5rem;
		background-color: var(--md-surface);
		color: var(--md-on-surface);
		& > button {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
	}

	main {
		margin: auto;
		margin-bottom: 4rem;
		padding-inline: 0.5rem;
	}

	@media only screen and (min-width: 1000px) {
		main {
			margin-bottom: 0;
			padding: 0;
		}
	}

	.profile-img {
		aspect-ratio: 1/1;
		border-radius: 50%;
		height: 1.5em;
		outline: 1px solid var(--md-primary);
		outline-offset: 1px;
	}

	.loading {
		font-size: 6rem;
		margin: auto;
		padding-top: 4rem;
	}
</style>
