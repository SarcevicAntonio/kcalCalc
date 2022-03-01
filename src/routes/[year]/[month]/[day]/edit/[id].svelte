<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EatUnitForm from '$lib/EatUnitForm.svelte';
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
		showDelete
		on:save={(e) => {
			eatUnits.updateEntry(e.detail);
			goto('/' + e.detail.date.replaceAll('-', '/'));
		}}
		on:delete={(e) => {
			eatUnits.remove(id);
			goto('/' + e.detail.date.replaceAll('-', '/'));
		}}
	/>
{/if}
