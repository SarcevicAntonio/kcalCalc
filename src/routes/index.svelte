<script lang="ts">
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import IcEdit from '~icons/ic/round-swap-horiz';
</script>

<Switcher>
	<h2 class="headline-1">Today</h2>
	<span class="label-l"> ... kcal </span>
</Switcher>

{#each { length: 4 } as _}
	<ItemSkeleton>
		<div class="row">
			<span class="title-l">Fake Bucket</span>
			<button class="btn text"> <IcEdit /> </button>
		</div>
	</ItemSkeleton>
{/each}

<style>
	.row {
		display: flex;
	}
	.title-l {
		min-height: 2em;
	}
</style>
