<script lang="ts">
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IconDelete from '~icons/mdi/delete';
	import Input from './Input.svelte';
	import { deleteIngredient, ingredientPresets, type Ingredient } from './stores/ingredients';

	const dispatch = createEventDispatcher<{ select: Ingredient }>();

	let value = '';

	$: filtered = $ingredientPresets.filter((v) =>
		v.label.toLowerCase().includes(value.toLowerCase())
	);
</script>

<div class="wrapper col gap">
	{#each filtered as item (item.docId)}
		<div class="row gap">
			<Dialog let:toggle>
				<svelte:fragment slot="trigger-label">
					<IconDelete />
				</svelte:fragment>
				<h1>Zutat Löschen</h1>
				<p>Sicher, dass du "{item.label}" löschen willst?</p>
				<p>Die ist dann halt für immer weg, ne?</p>
				<svelte:fragment slot="dialog-actions">
					<button
						on:click={() => {
							toggle();
						}}
					>
						Doch nicht
					</button>
					<button
						on:click={() => {
							deleteIngredient(item);
							toggle();
						}}
					>
						<IconDelete /> Einheit Löschen
					</button>
				</svelte:fragment>
			</Dialog>
			<button
				class="grow tone"
				on:click={() => {
					dispatch('select', item);
				}}
			>
				{item.label} <span style="margin-left: auto;" />
			</button>
		</div>
	{/each}
</div>
<Input bind:value type="text">Suchen</Input>

<style>
	.wrapper {
		overflow-y: auto;
		max-height: 30em;
		min-width: 14em;
		margin-bottom: 0.5em;
	}
</style>
