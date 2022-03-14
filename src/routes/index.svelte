<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/' + new Date().toISOString().split('T')[0].replaceAll('-', '/'));
	});
</script>