<script>
	import { v4 as uuidv4 } from 'uuid';

	export let value;

	const id = uuidv4();

	export let type = 'number';

	const handleInput = (e) => {
		// in here, you can switch on type and implement
		// whatever behaviour you need
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
	};
</script>

<div>
	<label for={id}>
		<slot />
	</label>
	<input {type} {value} {id} on:input={handleInput} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
	}
</style>
