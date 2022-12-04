<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { v4 as uuidv4 } from 'uuid'
	const dispatch = createEventDispatcher()

	export let value: string | number = ''
	export let placeholder = null
	export let options: Array<{ label: string; value: string | number }> = []
	export let disabled = false
	export let outlined = false
	export let selectElement: HTMLSelectElement = null

	const id = uuidv4()

	const focusInput = () => selectElement.focus()
</script>

<div
	class="container"
	on:click={focusInput}
	on:keydown={() => {}}
	on:keyup={() => {}}
	on:keypress={() => {}}
	class:disabled
	class:outlined
>
	<label for={id}>
		<slot />
	</label>
	<select
		bind:this={selectElement}
		bind:value
		{id}
		{placeholder}
		{disabled}
		on:input
		on:change
		on:focus
		on:blur
	>
		{#each options as { label, value }}
			<option {value}>
				{label}
			</option>
		{/each}
	</select>
</div>

<style src="./input.css"></style>
