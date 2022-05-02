<script>
	import Input from '$lib/Input.svelte';
	import { userSettings } from '$lib/stores/user';
</script>

{#await userSettings.load()}
	Loading ...
{:then}
	<Input type="number" bind:value={$userSettings.kcalLimit}>Kcal Day Limit / Warning</Input>
{/await}

<a
	href="https://www.tk.de/service/app/2004134/kalorienrechner/einstieg.app?tkcm=ab"
	target="_blank"
>
	Kalo­ri­en­be­darfs­rechner von TK
</a>
