<script>
	import IconProfile from '~icons/ic/round-account-circle';
	import { user } from './stores/user';
</script>

{#if $user}
	<a sveltekit:prefetch class="btn text" href="/profile">
		{#if $user.photoURL}
			<img src={$user.photoURL} alt="Your Profile" />
		{:else}
			<IconProfile />
		{/if}
	</a>
{/if}

<style>
	img {
		aspect-ratio: 1/1;
		border-radius: 50%;
		height: 1rem;
		outline: 1px solid var(--md-primary);
		outline-offset: 1px;
	}
</style>
