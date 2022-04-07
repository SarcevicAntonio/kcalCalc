<script lang="ts">
	import { goto } from '$app/navigation';

	import { isLinkMagic, signInWithMagicLink } from '$lib/firebase/client';
	import Input from '$lib/Input.svelte';
	import { clearMagicEmail, getMagicEmail } from '$lib/stores/magicEmail';
	import { setUser } from '$lib/stores/user';
	import { onMount } from 'svelte';

	let formState: 'validating' | 'idle' | 'submitting' | Error = 'validating';

	onMount(() => {
		if (!isLinkMagic(window.location.href)) {
			formState = new Error("Your link isn't magical.");
			return;
		}

		const magicEmail = getMagicEmail();
		if (!magicEmail) {
			formState = 'idle';
			return;
		}

		login(magicEmail);
	});

	async function login(email) {
		formState = 'submitting';
		const result = await signInWithMagicLink(email, window.location.href);
		const token = await result.user.getIdToken();
		const user = await fetch('/auth/session', {
			method: 'POST',
			headers: new Headers({ Authorization: 'Bearer ' + token }),
		}).then((res) => res.json());

		clearMagicEmail();
		setUser(user);

		goto('/profile');
	}

	async function handleSubmit({ currentTarget }) {
		login(new FormData(currentTarget).get('email'));
	}
</script>

<div class="col center logo">
	<img src="/favicon.svg" alt="kcalCalc Logo" />
	<h1>kcalCalc</h1>
</div>

<h2>Confirm login with magic link</h2>
{#if formState === 'validating'}
	<p>Validating magic link...</p>
{:else if formState === 'idle'}
	<form on:submit|preventDefault={handleSubmit}>
		<div class="col gap">
			<Input name="email" type="email" placeholder="example@gmail.com">E-Mail</Input>
			<button>Login</button>
		</div>
	</form>
{:else if formState === 'submitting'}
	<p>Logging in...</p>
{:else if formState instanceof Error}
	<p>There was an error validating your link. Please try again</p>
	<p>{formState.message}</p>
{/if}
