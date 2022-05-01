<script lang="ts">
	import { navigating } from '$app/stores';
	import ProfileLink from '$lib/ProfileLink.svelte';
	import { Notifications } from 'as-comps';
	import '../css/global.css';

	// polyfill: replaceAll
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function (
			str: string | RegExp,
			newStr: string | ((substring: string, ...args: any[]) => string)
		) {
			return this.replace(new RegExp(str, 'g'), newStr);
		};
	}
</script>

<header>
	<img src="/icon-mono.svg" alt="kcalCalc Logo" />
	<h1>kcalCalc</h1>
	<ProfileLink />
</header>

<main class:navigating={$navigating}>
	<slot />
</main>

<Notifications />

<style lang="postcss">
	h1 {
		font-family: 'Roboto';
		font-weight: 400;
		font-size: 36px;
		line-height: 44px;
		font-weight: bold;
	}
	img {
		height: auto;
		width: auto;
	}

	header {
		display: flex;
		justify-content: space-between;
		padding-block: 0.25em;
		padding-left: 1em;
		background-color: var(--md-surface);
		color: var(--md-on-surface);
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 0.75em;
		max-width: 25em;
		margin: auto;
		margin-bottom: 4em;
		padding-left: 0.5em;
		padding-right: 0.5em;
		transition: opacity 0.2 ease-in-out;
	}

	.navigating {
		animation: loading 0.5s infinite alternate;
	}
	@keyframes loading {
		from {
			opacity: 0.66;
		}
		to {
			opacity: 0.33;
		}
	}
</style>
