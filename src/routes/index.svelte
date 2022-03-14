<script lang="ts">
	import { user } from '$lib/stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconHome from '~icons/mdi/home';

	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
</script>

{#if !$user}
	<p>You can use kcalCalc without logging in, or login to sync your data.</p>
{/if}

<nav>
	<a href={todayLink}><IconHome />Heute</a>
	{#if !$user}
		<a href="/login" class=" primary"><IconLogin />Login</a>
	{/if}
</nav>

<style>
</style>
