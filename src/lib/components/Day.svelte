<script>
	import { defaultDay, setDayData } from '$lib/stores/intake';
	import IconWeek from '~icons/ic/round-date-range';
	import Bucket from './Bucket.svelte';
	import ItemSkeleton from './ItemSkeleton.svelte';

	export let date;
	export let data = defaultDay;

	async function updateData() {
		setDayData(date, data);
	}
</script>

	{#if data?.meals}
		{#each data.meals as { label, intake } (label)}
			<Bucket {label} bind:items={intake} on:update={updateData} />
		{/each}
	{:else}
		{#each { length: 4 } as _}
			<ItemSkeleton>
				<div class="row">
					<span class="title-l">Fake Bucket</span>
					<button class="btn text"> <IconWeek /> </button>
				</div>
			</ItemSkeleton>
		{/each}
	{/if}

<style>
	.title-l {
		min-height: 2em;
	}
	.row {
		display: flex;
	}
</style>
