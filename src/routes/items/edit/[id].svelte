<script lang="ts">
	import { page } from '$app/stores';
	import ItemSelector from '$lib/components/ItemSelector.svelte';
	import Item from '$lib/components/Item.svelte';
	import Input from '$lib/Input.svelte';
	import { calculateAmountSum, calculateKcalPer100FromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';
	import { Dialog } from 'as-comps';
	import MdiArrowLeft from '~icons/ic/round-arrow-back';
	import MdiDeleteForever from '~icons/ic/round-delete-forever';
	import IcPlus from '~icons/ic/round-plus';
	import { getItem } from '../_items';

	const id = parseInt($page.params.id);

	const item = getItem(id);
</script>

<h2 class="headline-1">Edit Item</h2>

<Input bind:value={item.label}>Label</Input>
<Input bind:value={item.brand}>Brand</Input>

<span class="label-l">
	{kcalDisplay(calculateKcalPer100FromItems(item.items))}
	kcal per 100 g || ml
</span>

<div class="row jcsb">
	<h3 class="headline-4">Items</h3>
	<ItemSelector />
</div>

{#each item.items as child}
	<Item bind:item={child} />
{/each}

{#if item.overrideAmount}
	<Input type="calc" bind:value={item.overrideAmount}>Amount Sum</Input>
{:else}
	<Input type="calc" disabled value={calculateAmountSum(item.items)}>Amount Sum</Input>
{/if}
<div class="row gap  end aic">
	<input
		id="override-amount"
		type="checkbox"
		value={item.overrideAmount}
		on:input={() => {
			if (item.overrideAmount) {
				item.overrideAmount = 0;
			} else {
				item.overrideAmount = calculateAmountSum(item.items);
			}
		}}
	/>
	<label for="override-amount">Override Amount</label>
</div>

<div class="row jcsb">
	<h3 class="headline-4">Portions</h3>
	<button class="btn text"><IcPlus /> Add</button>
</div>

{#each item.portions as portion}
	<div class="card outlined col gap">
		<Input bind:value={portion.label}>Label</Input>
		<Input type="number" bind:value={portion.amount}>Amount in g || ml</Input>
	</div>
{/each}

<nav>
	<Dialog let:toggle>
		<svelte:fragment slot="trigger-label">
			<MdiDeleteForever />
		</svelte:fragment>
		<div class="col gap">
			<h2 class="headline-2">Are you sure?</h2>

			<p class="body-m">Deleting the item "{item.label}" can not be undone.</p>
			<div class="row jcsb">
				<button class="btn tonal" on:click={toggle}><MdiArrowLeft /> Do nothing </button>
				<button class="btn tonal" on:click={() => alert('TODO')}>
					<MdiDeleteForever />
					Delete
				</button>
			</div>
		</div>
	</Dialog>
	<a href="/items"><MdiArrowLeft /> Back</a>
</nav>

<style>
	h3 {
		margin-top: 0.25em;
	}
</style>
