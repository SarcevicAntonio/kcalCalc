<script>
	import { user } from './stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconProfile from '~icons/mdi/person';
</script>

{#if $user}
	<a href="/profile"> <IconProfile /> </a>
{:else}
	<a href="/login">
		<IconLogin />
	</a>
{/if}
