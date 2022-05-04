<script>
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import IcHome from '~icons/ic/round-home';
	import IconLogin from '~icons/ic/round-login';
</script>

<h2 class="headline-1">An Error Occured</h2>

<strong>{$page.status}</strong>

<pre>{JSON.stringify($page.error, null, 2).replace(/\\n/g, '\n')}
</pre>

{#if !$user}
	<p>Maybe try reloading or logging in.</p>

	<nav>
		<a sveltekit:prefetch href="/auth">
			<IconLogin /> Login
		</a>
	</nav>
{:else}
	<p>Maybe try reloading or going home.</p>
	<nav>
		<a sveltekit:prefetch href="/">
			<IcHome />
		</a>
	</nav>
{/if}

<style>
	pre {
		overflow: auto;
	}
</style>
