<script>
	import { slide } from 'svelte/transition';

	export let item;

	let expanded = false;
</script>

<div class="card inner col">
	<button class="row sb" on:click={() => (expanded = !expanded)}>
		<div class="col start">
			<span class="title-m">{item.label}</span>
			<span class="body-m">{item.brand}</span>
		</div>
		<div class="col end">change item</div>
	</button>

	{#if expanded}
		<div transition:slide class="col gap">
			<div class="spacer-s" />
			<label>
				kcal Per 100 g || ml
				<input type="number" disabled value={item.kcalPer100}>
			</label>
			{#each item.amounts as amount}
			<label>
				Amount in g || ml
				<input type="number" bind:value={amount}>
				cancel
			</label>
			reportion
			{/each}
		</div>
	{/if}
	<div class="spacer-m" />
</div>

<style>
	.card {
		padding-bottom: 0;
	}
	.spacer-m {
		min-height: 0.75em;
	}
	.spacer-s {
		min-height: 0.25em;
	}
</style>
