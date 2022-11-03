<script>
	import Input from '$lib/Input.svelte';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcPortion from '~icons/ic/round-photo-size-select-small';
	import IcAdd from '~icons/ic/round-plus';

	const dispatch = createEventDispatcher();

	export let amount;
	let divideBy = 2;

	$: portion = amount / divideBy;
</script>

<Dialog triggerProps={{ class: 'btn text' }} let:toggle>
	<svelte:fragment slot="trigger-label">
		<IcPortion />
	</svelte:fragment>
	<h2 class="headline-4 with-icon">
		<IcPortion />
		Create Portions
	</h2>

	<form
		class="col gap"
		on:submit|preventDefault={() => {
			dispatch('create', {
				key: '',
				label: 'Divided by ' + divideBy,
				amount: portion,
			});
			toggle();
		}}
	>
		<p>Amount: {amount} g||ml</p>
		<Input type="number" bind:value={divideBy}>Divide by</Input>
		<p>Portion: {portion} g||ml</p>
		<button class="btn tonal">
			<IcAdd /> Add Portion
		</button>
	</form>
</Dialog>

<style>
	h2 {
		margin-right: 2em;
	}

	form {
		text-align: center;
		margin-top: 0.5em;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	button {
		width: 100%;
	}
</style>
