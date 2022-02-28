<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EatUnitForm from '$lib/forms/EatUnitForm.svelte';
	import eatUnits from '$lib/stores/eatUnit';

	const { year, month, day } = $page.params;

	export let eatUnit = {
		label: null,
		date: [year, month, day].join('-'),
		kcal: 100,
		ingredients: []
	};
</script>

<EatUnitForm
	{eatUnit}
	on:save={(e) => {
		eatUnits.add(e.detail);
		goto('/' + e.detail.date.replaceAll('-', '/'));
	}}
/>
