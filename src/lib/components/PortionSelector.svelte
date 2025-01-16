<script>
	import { Dialog } from 'as-comps'
	import { createEventDispatcher } from 'svelte'
	import IcArrowBack from '~icons/ic/round-arrow-back'
	import IcPortion from '~icons/ic/round-photo-size-select-small'
	import IcAdd from '~icons/ic/round-plus'
	import IcReplace from '~icons/ic/round-sync'

	export let portions
	const dispatch = createEventDispatcher()
</script>

<Dialog
	let:toggle
	triggerProps={{ class: 'btn text' }}
	noCloseButton
	transitionOptions={{ duration: 100 }}
>
	<svelte:fragment slot="trigger-label">
		<IcPortion />
	</svelte:fragment>
	<div class="col gap">
		<h2 class="title-l">Select a portion size</h2>
		{#each portions as portion (portion.key)}
			<div class="card filled">
				<div class="col grow">
					<span class="title-l">
						{portion.label}
					</span>
					<span class="body-m">
						{portion.amount} g|ml
					</span>
				</div>

				<button
					class="btn text"
					on:click={() => {
						dispatch('select', portion)
						toggle()
					}}
				>
					<IcReplace />
				</button>
				<div class="divider"></div>
				<button
					class="btn text"
					on:click={() => {
						dispatch('add', portion)
						toggle()
					}}
				>
					<IcAdd />
				</button>
			</div>
		{/each}
		<button class="btn tonal" on:click={toggle}>
			<IcArrowBack /> Do nothing
		</button>
	</div>
</Dialog>

<style>
	.col {
		display: flex;
		flex-direction: column;
	}
	.gap {
		gap: 1rem;
	}

	.grow {
		flex-grow: 1;
	}
	.divider {
		border-left: 1px solid var(--md-outline);
		height: 2rem;
	}

	.card {
		display: flex;
		align-items: center;
	}
</style>
