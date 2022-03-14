<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ session }) => {
		if (session.user) {
			return {
				status: 200
			};
		}
		return {
			redirect: '/login',
			status: 302
		};
	};
</script>

<script>
	import { goto } from '$app/navigation';
	import { setUser, user } from '$lib/stores/user';
	import IconHome from '~icons/mdi/home';
	import IconLogout from '~icons/mdi/logout-variant';

	async function logout() {
		await fetch('/auth/session', {
			method: 'DELETE'
		});
		setUser(null);
		goto('/');
	}

	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
</script>

// TODO: Sync

<p>
	{$user.email}
</p>

<button on:click={logout}><IconLogout />Logout</button>

<nav>
	<a href={todayLink} class="row gap"><IconHome />Heute</a>
</nav>
