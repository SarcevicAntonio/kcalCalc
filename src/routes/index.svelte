<script lang="ts">
	import { goto } from '$app/navigation';
	import ItemSkeleton from '$lib/components/ItemSkeleton.svelte';
	import Switcher from '$lib/components/Switcher.svelte';
	import { toISODateString } from '$lib/dateHelpers';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import IcEdit from '~icons/ic/round-swap-horiz';

	onMount(() => {
		if ($user) {
			goto('/day/' + toISODateString(new Date()));
		} else {
			goto('/auth');
		}
	});
</script>

<Switcher>
	<h2 class="headline-1">Today</h2>
	<span class="label-l"> kcal </span>
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
