<script>
	import EatUnitForm from '$lib/forms/EatUnitForm.svelte';
	import eatUnits from '$lib/stores/eatUnit';
</script>

<EatUnitForm
	on:save={(e) => {
		eatUnits.add(e.detail);
		history.back();
	}}
/>
