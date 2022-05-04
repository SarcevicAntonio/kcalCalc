<script>
	import Input from '$lib/Input.svelte';
	import { userSettings } from '$lib/stores/user';
</script>

<div>
	{#await userSettings.load()}
		<Input type="number" disabled>Kcal Day Limit / Warning</Input>
	{:then}
		<Input type="number" bind:value={$userSettings.kcalLimit}>Kcal Day Limit / Warning</Input>
	{/await}
	<a
		href="https://www.tk.de/service/app/2004134/kalorienrechner/einstieg.app?tkcm=ab"
		target="_blank"
	>
		Kalo­ri­en­be­darfs­rechner von TK
	</a>
</div>

<style>
	a {
		color: var(--md-primary);
	}
	div {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
