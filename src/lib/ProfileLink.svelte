<script>
	import { user } from './stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconProfile from '~icons/mdi/person';
</script>

<a class="btn text" href="/auth">
	{#if $user}
		<IconProfile />
	{:else}
		<IconLogin />
	{/if}
</a>
