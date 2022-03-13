<script lang="ts">
	import { sendMagicLink } from '$lib/firebase';

	import Input from '$lib/Input.svelte';

	// onMount(() => {
	// 	goto('/' + new Date().toISOString().split('T')[0].replaceAll('-', '/'));
	// });
	let loggedIn = false;

	function handleSubmit({ currentTarget }) {
		const email = new FormData(currentTarget).get('email') as string;
		sendMagicLink(email, window.location.origin + '/auth/confirm');
	}
</script>

<div class="col center logo">
	<img src="/favicon.svg" alt="kcalCalc Logo" />
	<h1>kcalCalc</h1>
</div>
{#if !loggedIn}
	<h2>Login with Magic Link</h2>
	<form on:submit|preventDefault={handleSubmit}>
		<Input name="email" type="email" placeholder="example@gmail.com">E-Mail</Input>
		<button>Login</button>
	</form>
{/if}
