<script lang="ts">
	import { setRecentItem } from '$lib/data/items'
	import { Dialog } from 'as-comps'
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add'
	import { instanceCreatorState } from '.'
	import InstanceForm from '../InstanceForm.svelte'

	function confirm() {
		if (!$instanceCreatorState.instance.id.startsWith('CUSTOM')) {
			setRecentItem($instanceCreatorState.instance)
		}
		$instanceCreatorState.resolve($instanceCreatorState.instance)
		instanceCreatorState.set(null)
	}

	function handleDismiss() {
		$instanceCreatorState.resolve(undefined)
		instanceCreatorState.set(null)
	}
</script>

<Dialog
	isOpen={!!$instanceCreatorState}
	on:dismiss={handleDismiss}
	includedTrigger={false}
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<div class="col">
		<h2 class="headline-3 with-icon">
			<IcRoundPlaylistAdd />
			Track Item
		</h2>
		<form on:submit|preventDefault={() => confirm()}>
			<InstanceForm bind:item={$instanceCreatorState.instance}>
				<svelte:fragment slot="inline-inputs">
					<button class="btn tonal" data-testid="create-instance">
						<IcRoundPlaylistAdd /> Track
					</button>
				</svelte:fragment>
				{#each $instanceCreatorState.instance.portions as portion}
					<button
						class="btn tonal fill"
						type="button"
						on:click={() => {
							$instanceCreatorState.instance.amount = portion.amount
							confirm()
						}}
					>
						<IcRoundPlaylistAdd />
						Track {portion.label} ({portion.amount} g|ml)
					</button>
				{/each}
			</InstanceForm>
		</form>
	</div>
</Dialog>

<style>
	.fill {
		width: 100%;
	}
</style>
