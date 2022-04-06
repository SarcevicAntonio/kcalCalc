<script>
	import { slide } from 'svelte/transition';

	export let label;
	export let numItems = 2;
	export let kcal = 245;

	let expanded = false;
</script>

<div class="card col">
	<button class="row sb" on:click={() => (expanded = !expanded)}>
		<span class="title-l">{label}</span>
		<div class="col end">
			<span class="body-m">
				{numItems} Item{numItems !== 1 ? 's' : ''}
			</span>
			<span class="label-l">{kcal} kcal</span>
		</div>
	</button>

	{#if expanded}
		<div transition:slide>
			<div class="spacer-s" />
			<slot />
		</div>
	{/if}
	<div class="spacer-m" />
</div>

<style>
	.card {
		padding-bottom: 0;
	}
	.spacer-m {
		height: 0.75em;
	}
	.spacer-s {
		height: 0.5em;
	}
</style>
