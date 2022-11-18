<script>
	import { createEventDispatcher } from 'svelte'
	import IcArrowBack from '~icons/ic/round-arrow-back'
	import IcArrowForward from '~icons/ic/round-arrow-forward'
	const dispatch = createEventDispatcher()
</script>

<div class="row">
	<button
		class="btn text"
		on:click={() => dispatch('prev')}
	>
		<IcArrowBack />
	</button>
	<div class="col">
		<slot />
	</div>
	<button
		class="btn text"
		on:click={() => dispatch('next')}
	>
		<IcArrowForward />
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
