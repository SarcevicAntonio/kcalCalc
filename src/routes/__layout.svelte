<script lang="ts">
	import BucketSkeleton from '$lib/components/BucketSkeleton.svelte';

	import Login from '$lib/components/Login.svelte';
	import { auth } from '$lib/firebase';
	import ProfileLink from '$lib/ProfileLink.svelte';
	import { user } from '$lib/stores/user';
	import '../css/global.css';

	let authStateUnfetched = true;

	auth.onAuthStateChanged((changedUser) => {
		authStateUnfetched = false;
		if (!changedUser) {
			$user = null;
			return;
		}

		const { displayName, email, uid, photoURL } = changedUser;
		$user = {
			id: uid,
			email,
			displayName,
			photoURL,
		};
	});
</script>

<header>
	<div class="title">
		<img src="/icon-mono.svg" alt="kcalCalc Logo" />
		<h1>kcalCalc</h1>
	</div>
	<ProfileLink />
</header>

<main class="flow">
	{#if !$user && !authStateUnfetched}
		<Login />
	{:else}
		<slot />
	{/if}
</main>

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
	}

	main {
		margin: auto;
		margin-bottom: 4rem;
	}

	@media only screen and (max-width: 1000px) {
		main {
			padding-inline: 0.5rem;
		}
	}

	.title {
		display: flex;
		gap: 1rem;
	}
</style>
