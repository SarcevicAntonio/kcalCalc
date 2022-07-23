<script>
	import { userSettings } from '$lib/data/user';

	export let kcalInDay;

	$: overLimit = kcalInDay > ($userSettings?.kcalLimit || 9999);
</script>

<div class="bar" class:over-limit={overLimit}>
	<div
		class="inner"
		style={!isNaN(kcalInDay)
			? overLimit
				? `width: ${Math.min(($userSettings?.kcalLimit / kcalInDay) * 100, 100)}%;`
				: `width: ${Math.min((kcalInDay / $userSettings?.kcalLimit) * 100, 100)}%;`
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
		&.over-limit {
			background-color: var(--md-on-error);
			& .inner {
				background-color: var(--md-error);
			}
		}
	}

	.inner {
		background-color: var(--md-on-surface-variant);
		transition-property: width color;
		transition-duration: 0.2s;
		transition-timing-function: ease-in-out;
	}
</style>
