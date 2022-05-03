<script>
</script>

<div class="card filled">
	<slot>
		<div class="row">
			<span class="title-l">Item Label</span>
		</div>
		<div class="row">
			<span class="body-m">Item Brand</span>
		</div>
	</slot>
</div>

<style lang="postcss">
	.card.filled {
		animation-duration: 4s;
		animation-fill-mode: forwards;
		animation-iteration-count: infinite;
		animation-name: shimmer;
		animation-timing-function: linear;
		background: var(--md-surface-variant);
		background: linear-gradient(
			to right,
			var(--md-secondary-container) 0%,
			var(--md-surface-variant) 15%,
			var(--md-surface-variant) 85%,
			var(--md-secondary-container) 100%
		);
		background-size: 500px 100%;
		color: transparent !important;
		user-select: none;
		cursor: wait;
		& :global(*) {
			color: transparent !important;
		}
	}
	@keyframes shimmer {
		0% {
			background-position: -500px 0;
		}
		100% {
			background-position: 500px 0;
		}
	}
</style>
