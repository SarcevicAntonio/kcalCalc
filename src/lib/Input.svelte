<script lang="ts">
	import Fuse from 'fuse.js';
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

	// autocomplete
	export let options = undefined;
	export let optionLabel = 'label';
	let showOptions = false;
	let filtered = options;

	$: setFiltered(options, value);
	function setFiltered(options: any, value: string | number) {
		if (!options || !(value + '').trim()) return;
		const fuse = new Fuse(options, {
			keys: [optionLabel]
		});
		filtered = fuse.search(value + '').map((e) => e.item);
	}

	const handleInput = (e: Event) => {
		// handle types
		value = type.match(/^(number|range)$/)
			? +(e.target as HTMLInputElement).value
			: (e.target as HTMLInputElement).value;
		dispatch('input', value);
	};
</script>

<div use:clickOutside={{ enabled: showOptions, cb: () => (showOptions = false) }}>
	<label for={id}>
		<slot />
	</label>
	<input
		{type}
		{value}
		{id}
		{placeholder}
		{min}
		{max}
		on:input={handleInput}
		on:change
		on:focus={() => {
			showOptions = true;
		}}
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
	}
	input {
		width: 100%;
	}
	.options {
		position: absolute;
		top: 3.5em;
		z-index: 999;
		left: 0;
		right: 0;
		background-color: var(--md-surface);
		padding: 0.25em;
		border-radius: 0.5em;
		max-height: 180px;
		overflow-y: auto;
	}
	button {
		text-align: unset;
		padding: 0.5em;
		border: none;
		background: var(--md-secondary-container);
		color: var(--md-on-secondary-container);
	}
</style>
