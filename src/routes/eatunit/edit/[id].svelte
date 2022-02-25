<script context="module">
	export async function load({ params }) {
		return {
			props: {
				id: params.id
			}
		};
	}
</script>

<script>
	import EatUnitForm from '$lib/forms/EatUnitForm.svelte';
	import eatUnits, { getEatUnit } from '$lib/stores/eatUnit';
	import { onMount } from 'svelte';

	export let id;
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
