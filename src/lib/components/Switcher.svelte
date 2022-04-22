<script>
	import { createEventDispatcher } from 'svelte';
	import IconArrowLeft from '~icons/mdi/arrow-left-bold';
	import IconArrowRight from '~icons/mdi/arrow-right-bold';
	const dispatch = createEventDispatcher();
</script>

<div class="row">
	<button class="btn text" on:click={() => dispatch('prev')}>
		<IconArrowLeft />
	</button>
	<div class="col">
		<slot />
	</div>
	<button class="btn text" on:click={() => dispatch('next')}>
		<IconArrowRight />
	</button>
</div>

<style>
	.row {
		display: flex;
		justify-content: space-between;
	}

	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
