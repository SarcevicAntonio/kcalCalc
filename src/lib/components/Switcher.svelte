<script>
	import { createEventDispatcher } from 'svelte';

	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconArrowRight from '~icons/mdi/arrow-right-bold';
	const dispatch = createEventDispatcher();
</script>

<div class="row jcsb">
	<button class="btn text" on:click={() => dispatch('prev')}>
		<IconArrowLeft />
	</button>
	<div class="col center">
		<slot />
	</div>
	<button class="btn text" on:click={() => dispatch('next')}>
		<IconArrowRight />
	</button>
</div>

<style>
	button {
		align-self: center;
	}
</style>