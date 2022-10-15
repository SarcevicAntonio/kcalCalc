<script lang="ts">
	import { setRecentItem } from '$lib/data/items';
	import { Dialog } from 'as-comps';
	import IcRoundPlaylistAdd from '~icons/ic/round-playlist-add';
	import { instanceCreatorState } from '.';
	import InstanceForm from '../InstanceForm.svelte';

	let amountInputElement: HTMLInputElement;

	function confirm() {
		if (!$instanceCreatorState.instance.id.startsWith('CUSTOM')) {
			setRecentItem($instanceCreatorState.instance);
		}
		$instanceCreatorState.resolve($instanceCreatorState.instance);
		instanceCreatorState.set(null);
	}

	function handleDismiss() {
		$instanceCreatorState.resolve(undefined);
		instanceCreatorState.set(null);
	}

	async function focusInput() {
		amountInputElement.scrollIntoView();
		amountInputElement.focus();
	}
</script>

<Dialog
	isOpen={!!$instanceCreatorState}
	on:dismiss={handleDismiss}
	on:introend={focusInput}
	includedTrigger={false}
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
