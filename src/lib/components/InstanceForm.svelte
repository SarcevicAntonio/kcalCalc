<script lang="ts">
import Input from "$lib/Input.svelte";



export let item;
</script>

<div class="col">
	<div class="pad" />
	{#if item.id.startsWith('CUSTOM')}
	<Input bind:value={item.label} on:input={dispatchUpdate}>Custom Label</Input>
	{/if}
	<div class="row gap">
		{#if typeof item.id === 'string' && item.id.startsWith('CUSTOM')}
			{#if item.id === 'CUSTOM:KCAL+AMOUNT'}
				<Input type="calc" bind:value={item.kcalPer100} on:input={dispatchUpdate}>
					kcal Per 100x
				</Input>
			{/if}
		{:else}
			<Input type="number" disabled value={kcalDisplay(item.kcalPer100)}>kcal Per 100x</Input>
		{/if}
		<Input
			bind:inputElement={amountInputElement}
			type="calc"
			bind:value={item.amount}
			on:input={dispatchUpdate}
		>
			{#if item.id !== 'CUSTOM:KCAL_COUNT'}
				Amount
			{:else}
				Kcal
			{/if}
		</Input>
	</div>
		<div class="row">
			<button class="btn text" on:click={() => dispatch('delete')}>
				<IcDelete />
			</button>
			{#if item.portions?.length}
				<PortionSelector
					portions={item.portions}
					on:select={({ detail }) => {
						item.amount = detail.amount;
						dispatchUpdate();
					}}
					on:add={({ detail }) => {
						item.amount += detail.amount;
						dispatchUpdate();
					}}
				/>
			{/if}
		</div>
	</div>
