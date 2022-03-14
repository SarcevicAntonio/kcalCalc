<script>
	import { goto } from '$app/navigation';
	import { ymd } from '$lib/dateFormats';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/' + format(new Date(), ymd).replaceAll('-', '/'));
	});
</script>
