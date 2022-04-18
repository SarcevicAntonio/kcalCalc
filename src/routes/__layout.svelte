<script lang="ts">
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

<header class="row sb">
	<div class="row gap aic">
		<img src="/icon-mono.svg" alt="kcalCalc Logo" />
		<h1>kcalCalc</h1>
	</div>
	<ProfileLink />
</header>

<div class="col gap content">
	<slot />
</div>

<Notifications />

<style>
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
		padding: 1em;
		background-color: var(--md-surface);
		color: var(--md-on-surface);
	}
	.content {
		padding: 0.5em;
	}
</style>
