<script lang="ts">
	import { goto } from '$app/navigation';

	import { toISODateString } from '$lib/dateHelpers';
	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';

	import IconHome from '~icons/mdi/home';
	import IconLogin from '~icons/mdi/login-variant';

	onMount(() => {
		if ($user) {
			goto('/day/' + toISODateString(new Date()));
		} else {
			goto('/auth');
		}
	});
</script>