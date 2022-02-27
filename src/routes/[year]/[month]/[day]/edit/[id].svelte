<script>
	import { page } from '$app/stores';
	import EatUnitForm from '$lib/forms/EatUnitForm.svelte';
	import eatUnits, { getEatUnit } from '$lib/stores/eatUnit';
	import { onMount } from 'svelte';

	const { id } = $page.params;
	let eatUnit;
	onMount(() => {
		eatUnit = getEatUnit(id);
	});
</script>

{#if eatUnit}
	<EatUnitForm
		{eatUnit}
		on:save={(e) => {
			eatUnits.updateEntry(e.detail);
			history.back();
		}}
	/>
{/if}
