<script>
	import { calculateKcalPer100FromItems } from '$lib/kcal';
	import kcalDisplay from '$lib/kcalDisplay';

	export let item;
</script>

<div class="card filled row jcsb">
	<div class="col ais">
		<span class="title-l">{item.label}</span>
		<span class="body-m">
			{item.brand}
		</span>
	</div>
	<div class="col aie jcsb">
		<span class="body-m">
			{#if item.portions.lenght}
				{item.portions.length} port.
			{/if}
		</span>
		<div class="label-l">
			{kcalDisplay(item.items ? calculateKcalPer100FromItems(item.items) : item.kcalPer100)} kcal%g||ml
		</div>
	</div>
</div>
