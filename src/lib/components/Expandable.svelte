<script>
	import { slide } from 'svelte/transition';
	import { v4 as uuidv4 } from 'uuid';
	import Icon from '~icons/ic/round-expand-circle-down';

	export let open = false;
	export let disabled = false;
	export let buttonClass = 'filled';

	const id = uuidv4();
</script>

<button
	{...$$restProps}
	class="card {buttonClass}"
	{disabled}
	on:click={() => {
		open = !open;
	}}
	aria-expanded={open}
	aria-controls={id}
>
	<div class="row">
		<div class="summary">
			<slot name="summary" />
		</div>
		{#if !disabled}
			<div class="icon" class:open>
				<Icon />
			</div>
		{/if}
	</div>
	{#if open}
		<div transition:slide|local on:click|stopPropagation on:keyup|preventDefault>
			<slot />
		</div>
	{/if}
	<div class="pad" />
</button>

<style lang="postcss">
	.card {
		padding-bottom: 0;
	}

	.row {
		display: flex;
		align-items: center;
	}

	.icon {
		margin-left: 1em;
		line-height: 0px;
		transition: rotate 0.2s ease;
		&.open {
			rotate: 180deg;
		}
	}

	.summary {
		width: 100%;
	}

	.pad {
		min-height: 0.5rem;
	}
</style>
