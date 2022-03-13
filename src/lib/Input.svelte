<script lang="ts">
	import Fuse from 'fuse.js';
	import { createEventDispatcher } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import clickOutside from './clickOutside';

	const id = uuidv4();
	const dispatch = createEventDispatcher();

	export let value: any = '';
	export let placeholder = null;
	export let type = 'number';
	export let min = undefined;
	export let max = undefined;
	export let name;

	// autocomplete
	export let options = undefined;
	export let optionLabel = 'label';
	let showOptions = false;
	let limitOptions = 3;
	let filtered = options;

	$: setFiltered(options, value);
	function setFiltered(options, value) {
		if (!options || !value.trim()) return;
		const fuse = new Fuse(options, {
			keys: [optionLabel]
		});
		filtered = fuse
			.search(value)
			.map((e) => e.item)
			.slice(0, limitOptions);
	}

	const handleInput = (e) => {
		// handle types
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
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
		{name}
		on:input={handleInput}
		on:change
		on:focus={() => {
			showOptions = true;
		}}
	/>
	<!-- Autocomplete -->
	{#if showOptions && filtered && value}
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
		background-color: var(--bg);
		padding: 0.25em;
		box-shadow: var(--btn-shadow);
		border-radius: 0.5em;
	}
	button {
		text-align: unset;
		padding: 0.5em;
		background: var(--secondary);
	}
</style>
