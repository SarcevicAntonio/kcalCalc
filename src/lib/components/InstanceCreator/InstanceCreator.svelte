<script lang="ts">
	import { Dialog } from 'as-comps';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import { instanceCreatorState } from '.';
	import InstanceForm from '../InstanceForm.svelte';

	function confirm() {
		$instanceCreatorState.resolve($instanceCreatorState.instance);
		instanceCreatorState.set(null);
	}

	function handleDismiss() {
		$instanceCreatorState.resolve(undefined);
		instanceCreatorState.set(null);
	}

	let amountInputElement: HTMLInputElement;

	$: if (amountInputElement) {
		amountInputElement.scrollIntoView();
		amountInputElement.focus();
	}
</script>

<Dialog
	open={!!$instanceCreatorState}
	on:dismiss={handleDismiss}
	includedTrigger={false}
	noCloseButton
	--as-dialog-width="90%"
	--as-dialog-max-width="400px"
>
	<div class="col">
		<h2 class="headline-3 with-icon">
			<IcRoundPlaylistAdd />
			Track Item
		</h2>
		<InstanceForm bind:item={$instanceCreatorState.instance} bind:amountInputElement>
			<svelte:fragment slot="inline-inputs">
				<button class="btn tonal" on:click={() => confirm()}>
					<IcRoundPlaylistAdd /> Track
				</button>
			</svelte:fragment>
			{#each $instanceCreatorState.instance.portions as portion}
				<button
					class="btn tonal fill"
					on:click={() => {
						$instanceCreatorState.instance.amount = portion.amount;
						confirm();
					}}
				>
					<IcRoundPlaylistAdd />
					Track {portion.label} ({portion.amount} g|ml)
				</button>
			{/each}
		</InstanceForm>
	</div>
</Dialog>

<style>
	.fill {
		width: 100%;
	}
</style>
