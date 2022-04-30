<script>
	import IconProfile from '~icons/ic/round-account-circle';
	import IconLogin from '~icons/ic/round-login';
	import { user } from './stores/user';
</script>

<a sveltekit:prefetch class="btn text" href="/auth">
	{#if $user}
		<IconProfile />
	{:else}
		<IconLogin />
	{/if}
</a>
