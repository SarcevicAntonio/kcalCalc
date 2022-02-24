<script>
	import { v4 as uuidv4 } from 'uuid';
	export let value;

	const id = uuidv4();
</script>

<div>
	<label for={id}>
		<slot />
	</label>
	<input type="number" bind:value {id} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		width: 30%;
		max-width: 150px;
	}
</style>
