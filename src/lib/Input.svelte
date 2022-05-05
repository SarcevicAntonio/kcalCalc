<script lang="ts">
	import { evaluate } from 'mathjs';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	const id = uuidv4();
	const dispatch = createEventDispatcher();

	export let value: string | number = '';
	export let placeholder = null;
	export let type = 'text';
	export let min = undefined;
	export let max = undefined;
	export let name = '';
	export let disabled = false;

	export let outlined = false;

	const handleInput = (e: Event) => {
		// handle types
		value = ['number', 'range'].includes(type)
			? +(e.target as HTMLInputElement).value
			: (e.target as HTMLInputElement).value;
		(e.target as HTMLInputElement).value = value + '';
		dispatch('input', e);
	};

	let canNotEvaluate = false;

	const handleBlur = (e: Event) => {
		if (type !== 'calc') {
			dispatch('blur', e);
			return;
		}
		if (!value) value = 0;
		try {
			const evaluated = evaluate((value + '').replaceAll(',', '.'));
			canNotEvaluate = false;
			if (evaluated !== value) {
				value = evaluated;
				dispatch('input', e);
			}
		} catch (e) {
			canNotEvaluate = true;
		}
		dispatch('blur', e);
	};

	export let inputElement = null;
</script>

<div
	on:click={() => inputElement.focus()}
	class:error={canNotEvaluate}
	class:disabled
	class:outlined
>
	<label for={id}>
		<slot />
	</label>
	<input
		bind:this={inputElement}
		type={type === 'calc' ? 'tel' : type}
		{value}
		{id}
		{placeholder}
		{min}
		{max}
		{name}
		{disabled}
		on:input={handleInput}
		on:change
		on:focus={(e) => {
			dispatch('focus', e);
		}}
		on:blur={handleBlur}
	/>
</div>

<style lang="postcss">
	div {
		cursor: text;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex-grow: 1;
		position: relative;
		padding: 0.5rem 1rem;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		border-bottom: 1px solid var(--md-on-surface);
		background-color: var(--md-surface-variant);
		color: var(--md-on-surface-variant);

		&.outlined {
			background-color: transparent;
			border: 1px solid var(--md-outline);
			border-radius: 0.25rem;
			& label {
				color: var(--md-on-surface-variant);
			}
			color: var(--md-on-surface);
		}

		&:focus-within {
			border-color: var(--md-primary);
		}
	}

	label {
		cursor: text;
		color: var(--md-primary);
		font-size: var(--md-body--small);
	}

	input {
		font-size: var(--md-body--large);
		background-color: transparent;
		border: none;
		width: 100%;
		color: inherit;

		&:focus {
			outline: none;
		}
	}

	.error {
		border-color: var(--md-error);
		& label {
			color: var(--md-error);
		}
	}

	.disabled {
		background-color: var(--md-on-secondary-container--opacity-008);
		color: var(--md-on-surface);
		border-color: var(--md-on-surface--opacity-012);
		& > * {
			opacity: 0.75;
		}
	}
</style>
