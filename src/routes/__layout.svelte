<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import Items from '$lib/components/ItemDrawer.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { auth } from '$lib/firebase';
	import ProfileLink from '$lib/ProfileLink.svelte';
	import { user } from '$lib/stores/user';
	import { Notifications } from 'as-comps';
	import '../css/global.css';

	auth.onAuthStateChanged((changedUser) => {
		if (!changedUser) {
			$user = null;
			if (browser) goto('/auth');
			return;
		}

		const { displayName, email, uid, photoURL } = changedUser;
		$user = {
			id: uid,
			email,
			displayName,
			photoURL,
		};

		if ($page.url.pathname === '/') {
			goto('/day/' + toISODateString(new Date()));
		}
	});
</script>

<header>
	<img src="/icon-mono.svg" alt="kcalCalc Logo" />
	<h1>kcalCalc</h1>
	<ProfileLink />
</header>

<main class="flow">
	<slot />
</main>

<Notifications />

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
		padding-left: 1rem;
		background-color: var(--md-surface);
		color: var(--md-on-surface);
	}

	main {
		max-width: 25rem;
		margin: auto;
		margin-bottom: 4rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
	}
</style>
