<script>
	import { userSettings } from '$lib/data/user';

	export let kcalInDay;
</script>

<div class="bar">
	<div
		class="inner"
		class:over-limit={kcalInDay > ($userSettings?.kcalLimit || 9999)}
		style={!isNaN(kcalInDay)
			? `width: ${Math.min((kcalInDay / $userSettings?.kcalLimit) * 100, 100)}%;`
			: ''}
	/>
</div>

<style lang="postcss">
	.bar,
	.inner {
		min-height: 1rem;
		border-radius: 9999px;
	}

	.bar {
		background-color: var(--md-surface-variant);
		overflow: hidden;
	}

	.inner {
		background-color: var(--md-on-surface-variant);
		transition-property: width color;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
		&.over-limit {
			background-color: var(--md-error);
		}
	}
</style>
