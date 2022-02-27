<script>
import { browser } from "$app/env";


	let today = new Date();

	if (browser) {
		location.href = '/days/' + today.toISOString().split('T')[0];
	}
</script>
