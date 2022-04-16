<script lang="ts">
	import { user } from '$lib/stores/user';
	import IconLogin from '~icons/mdi/login-variant';
	import IconHome from '~icons/mdi/home';
	import Input from '$lib/Input.svelte';
	let todayLink = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');

	let value = 0;
</script>

{#if !$user}
	<p>You need to Login to use kcalCalc</p>
{/if}

<Input type="text" bind:value>text</Input>
<Input type="number" bind:value>number</Input>
<Input type="calc" bind:value>Calc</Input>
{value}

<br /><br />
{value / 2}

<nav>
	{#if !$user}
		<a href="/login"><IconLogin />Login</a>
	{:else}
		<a href="/day/xxx"><IconHome />Heute</a>
	{/if}
</nav>

<style>
</style>
