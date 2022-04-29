<script>
	import { page } from '$app/stores';
	import Home from '$lib/components/Home.svelte';
	import { user } from '$lib/stores/user';
	import IconLogin from '~icons/ic/round-login';
</script>

<h2 class="headline-1">An Error Occured</h2>

<strong>{$page.status}</strong>

<pre>{JSON.stringify($page.error, null, 2).replace(/\\n/g, '\n')}
</pre>

{#if !$user}
	<p>Maybe try reloading or logging in.</p>

	<nav>
		<a href="/auth">
			<IconLogin /> Login
		</a>
	</nav>
{:else}
	<p>Maybe try reloading or going home.</p>
	<nav>
		<Home />
	</nav>
{/if}

<style>
	pre {
		overflow: auto;
	}
</style>
