<script>
	import Input from '$lib/Input.svelte';
	import { slide } from 'svelte/transition';
	import IcEdit from '~icons/ic/round-edit';
	import IcDelete from '~icons/ic/round-delete-forever';
	import IcPortion from '~icons/ic/round-photo-size-select-small';
	import kcalDisplay from '$lib/kcalDisplay';
	export let item;

	let expanded = false;
</script>

<div class="card outlined col">
	<button class="row sb" on:click={() => (expanded = !expanded)}>
		<div class="col start">
			<span class="title-m">{item.label}</span>
			<span class="body-m">{item.brand}</span>
		</div>
		<div class="col end">
			<button class="btn text" on:click|stopPropagation>
				<IcEdit />
			</button>
		</div>
	</button>

	{#if expanded}
		<div transition:slide class="col gap">
			<div class="spacer-s" />
			<Input type="number" disabled value={item.kcalPer100}>kcal Per 100 g || ml</Input>
			<Input type="calc" bind:value={item.amount}>Amount in g || ml</Input>
			<div class="row sb aic">
				<button class="btn text">
					<IcDelete />
				</button>
				<button class="btn text">
					<IcPortion />
				</button>
				<span class="label-l"> {kcalDisplay((item.kcalPer100 / 100) * item.amount)} kcal </span>
			</div>
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
