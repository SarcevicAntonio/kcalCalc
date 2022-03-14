<script lang="ts">
	import ProfileLink from '$lib/ProfileLink.svelte';

	import { Notifications } from 'as-comps';

	import '../styles.css';

	// polyfill: replaceAll
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function (str, newStr) {
			return this.replace(new RegExp(str, 'g'), newStr);
		};
	}
</script>

<header class="row sb">
	<div class="row gap">
		<img src="/icon-header.svg" alt="kcalCalc Logo" />
		<h1>kcalCalc</h1>
	</div>
	<ProfileLink />
</header>

<div class="col gap content">
	<slot />
</div>

<Notifications />

<style>
	header {
		padding-inline: 0.5em;
		background: var(--secondary);
	}
	.content {
		padding: 0.5em;
	}
</style>
