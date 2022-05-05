<script lang="ts">
	import { calculateKcalPer100FromItems } from '$lib/kcal';
	import { kcalDisplay } from '$lib/kcal';
	import type { Item } from '$lib/data/items';

	export let item: Item;
</script>

<div class="card filled">
	<div class="row">
		<span class="title-l">{item.label}</span>
		<span class="body-m">
			{#if item.portions.length}
				{item.portions.length} port.
			{/if}
		</span>
	</div>
	<div class="row">
		<span class="body-m">
			{item.brand}
		</span>
		<span class="label-l">
			{kcalDisplay(item.kcalPer100 || calculateKcalPer100FromItems(item.items, item.amount))} kcal%g||ml
		</span>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
</style>
