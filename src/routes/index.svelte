<script context="module">
	export function load() {
		const today = '/' + new Date().toISOString().split('T')[0].replaceAll('-', '/');
		return {
			redirect: today,
			status: 302
		};
	}
</script>
