<script>
	import { v4 as uuidv4 } from 'uuid';
	export let value;

	const id = uuidv4();
</script>

<label for={id}>
	<span>
		<slot />
	</span>
	<input type="number" bind:value {id} />
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		width: 30%;
		max-width: 150px;
	}
</style>
