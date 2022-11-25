<script lang="ts">
	import { evaluate } from 'mathjs'
	import { createEventDispatcher } from 'svelte'
	import { v4 as uuidv4 } from 'uuid'
	import IcRoundClear from '~icons/ic/round-clear'
	import IcCalc from '~icons/mdi/calculator'
	const dispatch = createEventDispatcher()

	export let value: string | number = ''
	export let placeholder = null
	export let type: 'text' | 'calc' | 'number' = 'text'
	export let min = undefined
	export let max = undefined
	export let name = ''
	export let disabled = false
	export let outlined = false
	export let clearable = false
	export let inputElement: HTMLInputElement = null

	const id = uuidv4()
	let canNotEvaluate = false

	const handleInput = (e: Event) => {
		// handle types
		value = ['number', 'range'].includes(type)
			? +(e.target as HTMLInputElement).value
			: (e.target as HTMLInputElement).value
		;(e.target as HTMLInputElement).value = value + ''
		dispatch('input', e)
	}

	const handleBlur = (e: Event) => {
		if (type !== 'calc') {
			dispatch('blur', e)
			return
		}
		if (!value) value = 0
		try {
			const evaluated = evaluate((value + '').replaceAll(',', '.'))
			canNotEvaluate = false
			if (evaluated !== value) {
				value = evaluated
				dispatch('input', e)
			}
		} catch (e) {
			canNotEvaluate = true
		}
		dispatch('blur', e)
	}

	const focusInput = () => inputElement.focus()
</script>

<div
	class="container"
	on:click={focusInput}
	on:keydown={() => {}}
	on:keyup={() => {}}
	on:keypress={() => {}}
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
		name={name || null}
		{disabled}
		on:input={handleInput}
		on:change
		on:focus={(e) => {
			dispatch('focus', e)
		}}
		on:blur={handleBlur}
	/>
	<div class="inline">
		<slot name="inline" />
		{#if type === 'calc' && value && typeof value === 'string' && /\+|-|\*|\//.test(value)}
			<button class="inline-btn"><IcCalc /></button>
		{/if}
		{#if clearable && value}
			<button class="inline-btn" on:click={() => (value = '')}>
				<IcRoundClear />
			</button>
		{/if}
	</div>
</div>

<style src="./input.css"></style>
