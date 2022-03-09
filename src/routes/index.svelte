<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/' + new Date().toISOString().split('T')[0].replaceAll('-', '/'));
	});
</script>

<div class="col center logo">
	<img src="/favicon.svg" alt="kcalCalc Logo" />
	<h1>kcalCalc</h1>
</div>
