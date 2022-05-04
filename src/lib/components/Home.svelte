<script>
	import { toISODateString } from '$lib/dateHelpers';
	import { curDay } from '$lib/stores/intake';
	import { createEventDispatcher } from 'svelte';
	import IcHome from '~icons/ic/round-home';
	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => {
		$curDay = toISODateString(new Date());
		dispatch('toggleWeekGraph');
	}}
>
	<IcHome />
</button>
