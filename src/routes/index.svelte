<script lang="ts">
	import { user } from '$lib/stores/user';

	import IconHome from '~icons/mdi/home';
	import IconLogin from '~icons/mdi/login-variant';
	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');

	$: console.log($user);
</script>

<a href="/day/xyz"> Go to new day view </a>

<a href="/items"> Go to new item view </a>

{#if $user !== 'INIT'}
	{#if !$user}
		<p>You need to Login to use kcalCalc</p>
	{/if}

	<nav>
		{#if !$user}
			<a href="/auth"><IconLogin />Login</a>
		{:else}
			<a href="/day/xxx"><IconHome />Heute</a>
		{/if}
	</nav>
{:else}
	loading ...
{/if}

<style>
</style>
