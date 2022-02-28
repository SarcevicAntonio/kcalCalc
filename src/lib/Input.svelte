<script>
	import { v4 as uuidv4 } from 'uuid';

	export let value;
	export let placeholder = null;

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
	<input {type} {value} {id} {placeholder} on:input={handleInput} />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
		flex-grow: 1;
	}
	input {
		width: 100%;
	}
</style>
