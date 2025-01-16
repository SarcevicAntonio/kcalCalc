<script>
	import { slide } from 'svelte/transition'
	import { v4 as uuidv4 } from 'uuid'
	import Icon from '~icons/ic/round-expand-circle-down'

	export let open = false
	export let disabled = false

	const regionId = uuidv4()
	const buttonId = uuidv4()
</script>

<div class="card filled">
	<h3>
		<button
			class="row"
			aria-disabled={disabled}
			on:click={() => {
				if (disabled) return
				open = !open
			}}
			aria-expanded={open}
			aria-controls={regionId}
			id={buttonId}
			{...$$restProps}
		>
			<div class="summary">
				<slot name="summary" />
			</div>
			{#if !disabled}
				<div class="icon" class:open>
					<Icon />
				</div>
			{/if}
		</button>
	</h3>
	{#if open}
		<div
			transition:slide
			id={regionId}
			role="region"
			aria-labelledby={buttonId}
		>
			<div class="pad"></div>
			<slot />
		</div>
	{/if}
</div>

<style lang="postcss">
	.card {
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

	button {
		width: stretch;
	}
</style>
