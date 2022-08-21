<script>
	import { slide } from 'svelte/transition';

	export let open = false;
	export let disabled = false;

	export let buttonClass = 'filled';

	const id = crypto.randomUUID();
</script>

<button
	class="card {buttonClass}"
	{disabled}
	on:click={() => {
		open = !open;
	}}
	aria-expanded={open}
	aria-controls={id}
>
	<slot name="summary" />
	{#if open}
		<div transition:slide|local on:click|stopPropagation on:keyup|preventDefault>
			<slot />
		</div>
	{/if}
	<div class="pad" />
</button>

<style>
	.card {
		padding-bottom: 0;
	}

	.pad {
		min-height: 0.5rem;
	}
</style>
