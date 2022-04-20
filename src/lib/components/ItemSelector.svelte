<script>
	import Input from '$lib/Input.svelte';
	import { Dialog } from 'as-comps';
	import IcEdit from '~icons/ic/round-edit';
	import IcPlus from '~icons/ic/round-plus';
	import { items } from '../../routes/items/_items';
	import ItemCard from './ItemCard.svelte';
	import Fuse from 'fuse.js';

	export let edit = false;

	let search = '';

	let filtered = items;

	$: setFiltered(items, search);
	function setFiltered(options, value) {
		if (!options || !(value + '').trim()) {
			filtered = items;
			return;
		}
		const fuse = new Fuse(options, {
			keys: ['label'],
		});
		filtered = fuse.search(value + '').map((e) => e.item);
	}

	let dialogOpen = false;

	function toggle() {
		dialogOpen = !dialogOpen;
	}

	let fddbEntries = [];

	async function searchFddb() {
		await fetch('/search/' + encodeURIComponent(search))
			.then((res) => res.json())
			.then((res) => {
				fddbEntries = res;
			});
	}
</script>

<button class="btn text" on:click|stopPropagation={toggle}>
	{#if edit}
		<IcEdit />
	{:else}
		<IcPlus /> Add
	{/if}
</button>

<Dialog bind:open={dialogOpen} includedTrigger={false}>
	<svelte:fragment slot="trigger-label" />
	<div class="col gap content">
		<h2 class="headline-2">Select Item</h2>
		<button
			on:click={() => {
				alert('TODO');
			}}
		>
			<div class="card filled row jcsb aie">
				<span class="title-l">Custom kcal count</span>
			</div>
		</button>
		<button
			on:click={() => {
				alert('TODO');
			}}
		>
			<div class="card filled row jcsb aie">
				<span class="title-l">Custom kcal & amount</span>
			</div>
		</button>
		<Input bind:value={search}>Search</Input>
		{#each filtered as item}
			<button
				on:click={() => {
					alert('TODO');
				}}
			>
				<ItemCard {item} />
			</button>
		{/each}
		{#if search}
			{#if !fddbEntries.length}
				<button class="card filled row jcsb aie..." on:click={searchFddb}>
					<span class="title-l"> Search FDDB... </span>
				</button>
			{:else}
				{#each fddbEntries as item}
					<button
						on:click={() => {
							alert('TODO');
						}}
					>
						<ItemCard {item} />
					</button>
				{/each}
			{/if}
		{/if}
	</div>
</Dialog>

<style>
	.content {
		width: 100%;
	}
</style>
