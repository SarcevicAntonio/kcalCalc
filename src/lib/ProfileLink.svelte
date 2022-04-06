<script>
	import { user } from './stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconProfile from '~icons/mdi/person';
</script>

{#if $user}
	<a class="btn txt-only" href="/profile"> <IconProfile /> </a>
{:else}
	<a class="btn txt-only" href="/login">
		<IconLogin />
	</a>
{/if}
