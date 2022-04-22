<script>
	import Input from '$lib/Input.svelte';
	import { Dialog } from 'as-comps';
	import IcEdit from '~icons/ic/round-edit';
	import IcPlus from '~icons/ic/round-plus';
	import { items } from '../../routes/items/_items';
	import ItemCard from './ItemCard.svelte';
	import Fuse from 'fuse.js';

	export let edit = false;
	export let end = false;
	export let tonal = false;
	export let noCustomKcal = false;
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

<button class:end class="btn {tonal ? 'tonal' : 'text'}" on:click|stopPropagation={toggle}>
	{#if edit}
		<IcEdit />
	{:else}
		<IcPlus /> Add
	{/if}
</button>

<Dialog bind:open={dialogOpen} includedTrigger={false}>
	<svelte:fragment slot="trigger-label" />
	<div class="content">
		<h2 class="headline-2">Select Item</h2>

		{#if !noCustomKcal}
			<button
				on:click={() => {
					alert('TODO');
				}}
			>
				<div class="card filled">
					<span class="title-l">Custom kcal count</span>
				</div>
			</button>
		{/if}

		<button
			on:click={() => {
				alert('TODO');
			}}
		>
			<div class="card filled">
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
				<button class="card filled" on:click={searchFddb}>
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
	.end {
		margin-left: auto;
	}
	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;

		width: min(calc(100vw - 6em), 400px);
	}
</style>
