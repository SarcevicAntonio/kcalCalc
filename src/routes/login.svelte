<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = ({ session }) => {
		if (session.user) {
			return {
				redirect: '/profile',
				status: 302,
			};
		}
		return {
			status: 200,
		};
	};
</script>

<script lang="ts">
	import { sendMagicLink } from '$lib/firebase/client';
	import Input from '$lib/Input.svelte';
	import { setMagicEmail } from '$lib/stores/magicEmail';
	import { user } from '$lib/stores/user';
	let formState: 'initial' | 'submitting' | 'send' | Error = 'initial';
	async function handleSubmit({ currentTarget }) {
		formState = 'submitting';
		const email = new FormData(currentTarget).get('email') as string;
		setMagicEmail(email);
		try {
			await sendMagicLink(email, window.location.origin + '/auth/confirm');
		} catch (error) {
			formState = error;
		}
		formState = 'send';
	}

	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
</script>

{#if !$user}
	<h2>Login with magic link</h2>
	{#if formState === 'initial'}
		<form on:submit|preventDefault={handleSubmit}>
			<div class="col gap">
				<Input name="email" type="email" placeholder="example@gmail.com">E-Mail</Input>
				<button>Login</button>
			</div>
		</form>
	{:else if formState === 'submitting'}
		<p>Sending magic link...</p>
	{:else if formState === 'send'}
		<p>Your magic login link should in your inbox!</p>
	{:else if formState instanceof Error}
		<p>Whoops, there was an error sending your email. Please try again</p>
		<p>{formState.message}</p>
	{/if}
{:else}
	<a href={todayLink}>Go to today</a>
{/if}
