<script>
</script>

<div class="card filled skeleton">
	<slot>
		<div class="row">
			<span class="title-l">Item Label</span>
		</div>
		<div class="row">
			<span class="body-m">Item Brand</span>
		</div>
	</slot>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
</style>
