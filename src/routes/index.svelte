<script>
	import IconCalculator from '~icons/mdi/calculator';
	import IconToday from '~icons/mdi/calendar-today';
</script>

<div class="row center">
	<h1>kcalCalc</h1>
</div>

<div class="notice">// todo: logo</div>

<nav>
	<a href="/calc">
		<IconCalculator />
		Calculator
	</a>
	<a href={'/' + new Date().toISOString().split('T')[0].replaceAll('-', '/')}>
		<IconToday /> Heute
	</a>
</nav>

<style>
	nav {
		flex-direction: column;
		gap: 1em;
	}
</style>
