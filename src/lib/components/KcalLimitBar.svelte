<script lang="ts">
	export let amount: number
	export let limit = 9999

	$: overLimit = amount > limit
</script>

<div class="bar" class:over-limit={overLimit}>
	<div
		class="inner"
		style={!isNaN(amount)
			? overLimit
				? `width: ${Math.min((limit / amount) * 100, 100)}%;`
				: `width: ${Math.min((amount / limit) * 100, 100)}%;`
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
			background-color: var(--md-error);
			& .inner {
				background-color: var(--md-error-container);
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
