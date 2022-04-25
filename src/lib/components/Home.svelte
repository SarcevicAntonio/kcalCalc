<script>
	import { toISODateString } from '$lib/dateHelpers';
	import IcHome from '~icons/ic/round-home';
</script>

<a href="/day/{toISODateString(new Date())}">
	<IcHome />
</a>
