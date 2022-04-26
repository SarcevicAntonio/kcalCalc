<script>
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcPortion from '~icons/ic/round-photo-size-select-small';

	export let portions;
	const dispatch = createEventDispatcher();
</script>

<Dialog let:toggle triggerClass="btn text">
	<svelte:fragment slot="trigger-label">
		<IcPortion />
	</svelte:fragment>
	<div class="col">
		{#each portions as portion}
			<button
				class="card filled"
				on:click={() => {
					dispatch('select', portion);
					toggle();
				}}
			>
				<span class="title-l">
					{portion.label}
				</span>
				<span class="label-l">
					{portion.amount} g|ml
				</span>
			</button>
		{/each}
	</div>
</Dialog>

<style>
	.col {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	button {
		display: flex;
		justify-content: space-between;
	}
</style>
