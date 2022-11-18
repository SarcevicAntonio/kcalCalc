<script>
	import { defaultDay, setDayData } from '$lib/data/intake'
	import Bucket from './Bucket.svelte'
	import BucketSkeleton from './BucketSkeleton.svelte'

	export let date
	export let data = defaultDay

	async function updateData() {
		setDayData(date, data)
	}
</script>

{#if data?.meals}
	{#each data.meals as { label, intake } (label)}
		<Bucket {label} {date} bind:items={intake} on:update={updateData} />
	{/each}
{:else}
	{#each { length: 4 } as _}
		<BucketSkeleton />
	{/each}
{/if}
