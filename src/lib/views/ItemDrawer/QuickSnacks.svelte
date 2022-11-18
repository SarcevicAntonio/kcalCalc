<script>
	import { quickSnackTemplates, trackQuickSnack } from '$lib/data/quickSnacks'
	import { calculateKcal, kcalDisplay } from '$lib/kcal'
	import MaterialSymbolsOfflineBolt from '~icons/material-symbols/offline-bolt'
</script>

<h2 class="headline-3 with-icon"><MaterialSymbolsOfflineBolt /> Quick Snacks</h2>

{#each $quickSnackTemplates as item}
	<button
		class="card filled"
		on:click={() => {
			trackQuickSnack(item)
		}}
	>
		<div class="row">
			<span class="title-l">{item.label}</span>
			<span class="body-m">
				{item.portionLabel}
			</span>
		</div>
		<div class="row">
			<span class="body-m">
				{item.brand}
			</span>
			<span class="label-l">
				{kcalDisplay(calculateKcal(item))} kcal
			</span>
		</div>
	</button>
{/each}

<style>
	:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.row {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
</style>
