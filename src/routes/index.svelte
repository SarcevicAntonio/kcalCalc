<script lang="ts">
	import { user } from '$lib/stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconHome from '~icons/mdi/home';

	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
</script>

{#if !$user}
	<p>You need to Login to use kcalCalc</p>
{/if}

<nav>
	<a href={todayLink}><IconHome />Heute</a>
	{#if !$user}
		<a href="/login" class=" primary"><IconLogin />Login</a>
	{/if}
</nav>

<style>
</style>
