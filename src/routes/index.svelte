<script>
	import IconCalculator from '~icons/mdi/calculator';
	import IconToday from '~icons/mdi/calendar-today';
</script>

<div class="col center logo">
	<img src="/favicon.svg" alt="kcalCalc Logo">
	<h1>kcalCalc</h1>
</div>


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
	.logo {
		min-height: 50vh;
	}
	img {
		height: 10em;
	}
</style>
