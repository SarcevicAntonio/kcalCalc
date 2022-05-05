<script>
	import IconProfile from '~icons/ic/round-account-circle';
</script>

<button class="card filled skeleton">
	<div class="row">
		<span class="title-l">label</span>
		<div class="button text">
			<IconProfile />
		</div>
	</div>
	<!-- <div class="pad" /> -->
</button>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bucket-info {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: flex-end;
	}

	.title-l {
		display: flex;
		align-items: center;
		min-height: 2em;
	}
</style>
