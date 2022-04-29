<script>
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcPortion from '~icons/ic/round-photo-size-select-small';
	import IcReplace from '~icons/ic/round-sync';
	import IcAdd from '~icons/ic/round-plus';

	export let portions;
	const dispatch = createEventDispatcher();
</script>

<Dialog let:toggle triggerClass="btn text">
	<svelte:fragment slot="trigger-label">
		<IcPortion />
	</svelte:fragment>
	<h2 class="title-l">Select a portion size</h2>
	<div class="col gap">
		{#each portions as portion}
			<button
				class="card filled"
				on:click={() => {
					dispatch('select', portion);
					toggle();
				}}
			>
				<div class="col grow">
					<span class="title-l">
						{portion.label}
					</span>
					<span class="body-m">
						{portion.amount} g|ml
					</span>
				</div>

				<div class="btn text">
					<IcReplace />
				</div>
				<div class="divider" />
				<button
					class="btn text"
					on:click|stopPropagation={() => {
						dispatch('add', portion);
						toggle();
					}}
				>
					<IcAdd />
				</button>
			</button>
		{/each}
	</div>
</Dialog>

<style>
	.col {
		display: flex;
		flex-direction: column;
	}
	.gap {
		gap: 1em;
	}

	.grow {
		flex-grow: 1;
	}
	.divider {
		border-left: 1px solid var(--md-outline);
		height: 2em;
	}

	button {
		display: flex;
		align-items: center;
	}
</style>
