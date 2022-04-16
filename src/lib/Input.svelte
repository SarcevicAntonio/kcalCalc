<script lang="ts">
	import Fuse from 'fuse.js';
	import { evaluate } from 'mathjs';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import clickOutside from './clickOutside';

	const id = uuidv4();
	const dispatch = createEventDispatcher();

	export let value: string | number;
	export let placeholder = null;
	export let type = 'number';
	export let min = undefined;
	export let max = undefined;
	export let name = '';
	export let disabled = false;

	// autocomplete
	export let options = undefined;
	export let optionLabel = 'label';
	let showOptions = false;
	let filtered = options;

	$: setFiltered(options, value);
	function setFiltered(options: any, value: string | number) {
		if (!options || !(value + '').trim()) return;
		const fuse = new Fuse(options, {
			keys: [optionLabel],
		});
		filtered = fuse.search(value + '').map((e) => e.item);
	}

	const handleInput = (e: Event) => {
		// handle types
		value = type.match(/^(number|range)$/)
			? +(e.target as HTMLInputElement).value
			: (e.target as HTMLInputElement).value;
		(e.target as HTMLInputElement).value = value + '';
		dispatch('input', e);
	};

	let canNotEvaluate = false;

	const handleBlur = (e: Event) => {
		if (type.match(/^(calc)$/) && value) {
			try {
				value = evaluate((value + '').replaceAll(',', '.'));
				canNotEvaluate = false;
			} catch (e) {
				canNotEvaluate = true;
			}
		}
		dispatch('blur', e);
	};

	let inputElement;
</script>

<div
	on:click={() => inputElement.focus()}
	use:clickOutside={{ enabled: showOptions, cb: () => (showOptions = false) }}
	class:error={canNotEvaluate}
	class:disabled
>
	<label for={id}>
		<slot />
	</label>
	<input
		bind:this={inputElement}
		{type}
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
			showOptions = true;
			dispatch('focus', e);
		}}
		on:blur={handleBlur}
	/>
	<!-- Autocomplete -->
	{#if showOptions && filtered?.length && value}
		<div class="options">
			{#each filtered as option}
				<button
					disabled={option.disabled}
					on:click={() => {
						value = option[optionLabel];
						showOptions = false;
						dispatch('input', value);
						dispatch('change', value);
						dispatch('select', option);
					}}
				>
					{option[optionLabel]}
					<slot name="option-button-extra" {option} />
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		flex-grow: 1;
		position: relative;

		padding: 0.5em 1em;
		border-top-left-radius: 0.25em;
		border-top-right-radius: 0.25em;
		border-bottom: 1px solid var(--md-on-surface);
		background-color: var(--md-surface-variant);
	}

	div:focus-within {
		outline: 5px auto Highlight;
		outline: 5px auto -webkit-focus-ring-color;
	}

	label {
		font-size: var(--md-body--small);
	}

	input {
		font-size: var(--md-body--large);
		background-color: transparent;
		border: none;
		width: 100%;
		color: inherit;
	}

	input:focus {
		outline: none;
	}

	.options {
		position: absolute;
		top: 3.5em;
		z-index: 999;
		left: 0;
		right: 0;
		background-color: var(--md-surface);
		padding: 0.25em;
		border-radius: 28px;
		max-height: 180px;
		overflow-y: auto;
	}
	button {
		text-align: unset;
		border: none;
		background: var(--md-secondary-container);
		color: var(--md-on-secondary-container);
	}
	.error {
		background-color: var(--md-error);
		color: var(--md-on-error);
	}
	.disabled {
		background-color: var(--md-on-secondary-container-0-08);
		color: var(--md-on-surface);
	}
</style>
