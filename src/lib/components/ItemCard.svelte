<script>
	import { calculateKcalPer100FromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';

	export let item;
</script>

<div class="card filled">
	<div class="item-info">
		<span class="title-l">{item.label}</span>
		<span class="body-m">
			{item.brand}
		</span>
	</div>
	<div class="item-data">
		<span class="body-m">
			{#if item.portions.length}
				{item.portions.length} port.
			{/if}
		</span>
		<div class="label-l">
			{kcalDisplay(item.items ? calculateKcalPer100FromItems(item.items) : item.kcalPer100)} kcal%g||ml
		</div>
	</div>
</div>

<style>
	.card {
		display: flex;
		justify-content: space-between;
	}
	.item-info {
		display: flex;
		flex-direction: column;
	}
	.item-data {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: end;
	}
</style>
