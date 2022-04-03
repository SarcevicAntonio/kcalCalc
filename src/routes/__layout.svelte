<script lang="ts">
	import { Notifications } from 'as-comps';
	import '../styles.css';

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

<header class="row gap">
	<img src="/icon-mono.svg" alt="kcalCalc Logo" />
	<span>kcalCalc</span>
</header>

<div class="content col gap">
	<slot />
</div>
<Notifications />

<style>
	span {
		font-size: 2em;
		font-weight: 700;
	}
	header {
		padding-inline: 0.5em;
		background-color: var(--md-surface);
		color: var(--md-on-surface);
	}
	.content {
		padding: 0.5em;
	}
</style>
