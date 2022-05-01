<script>
	import Input from '$lib/Input.svelte';
	import { userSettings } from '$lib/stores/user';
</script>

{#await userSettings.load()}
	Loading User Settings...
{:then}
	<Input type="number" bind:value={$userSettings.kcalLimit}>Kcal Day Limit</Input>
{/await}
