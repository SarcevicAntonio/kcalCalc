<script lang="ts">
	import { user } from '$lib/stores/user';
	import IconHome from '~icons/mdi/home';
	import IconLogin from '~icons/mdi/login-variant';
	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
</script>

<a href="/day/xyz">
	Go to new day view
</a>

<a href="/items">
	Go to new item view
</a>

{#if !$user}
	<p>You need to Login to use kcalCalc</p>
{/if}

<nav>
	{#if !$user}
		<a href="/login"><IconLogin />Login</a>
	{:else}
		<a href="/day/xxx"><IconHome />Heute</a>
	{/if}
</nav>

<style>
</style>
