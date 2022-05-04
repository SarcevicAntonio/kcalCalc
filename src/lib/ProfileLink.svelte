<script>
	import IconProfile from '~icons/ic/round-account-circle';
	import IconLogin from '~icons/ic/round-login';
	import { user } from './stores/user';
</script>

<a sveltekit:prefetch class="btn text" href="/auth">
	{#if $user}
		{#if $user.photoURL}
			<img src={$user.photoURL} alt="Your Profile" />
		{:else}
			<IconProfile />
		{/if}
	{:else}
		<IconLogin />
	{/if}
</a>

<style>
	img {
		aspect-ratio: 1/1;
		border-radius: 50%;
		height: 1rem;
		outline: 1px solid var(--md-primary);
		outline-offset: 1px;
	}
</style>
