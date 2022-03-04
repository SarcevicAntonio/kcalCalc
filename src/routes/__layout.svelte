<script lang="ts">
	import { Notifications } from 'as-comps';

	import '../styles.css';

	// polyfill: replaceAll
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function (str, newStr) {
			return this.replace(new RegExp(str, 'g'), newStr);
		};
	}
</script>

<div class="col gap">
	<slot />
</div>
<Notifications />
