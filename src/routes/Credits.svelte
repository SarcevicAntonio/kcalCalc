<script>
	import { Dialog } from 'as-comps'
	import deps from '$lib/dependency-report.json'
	export let isOpen = false
</script>

<Dialog
	bind:isOpen
	includedTrigger={false}
	style="display: flex; flex-direction: column; gap: 0.5rem; width: 80vw; max-width: 800px;"
>
	<h2 class="headline-3">Credits</h2>
	<p>
		Copyright © {new Date().toJSON().substring(0, 4)}
		<a target="_blank" rel="noreferrer" href="https://www.sarcevic.dev/">
			Antonio Sarcevic
		</a>
	</p>
	<hr />
	<h3 class="headline-5">Made possible thanks to:</h3>
	<ul>
		{#each deps as dep, i}
			{@const link = dep.link.replace('git://', 'https://').replace('git+', '')}
			<li>
				<a target="_blank" rel="noreferrer" href={link}>{dep.name}</a>
				<span class="version">@ {dep.installedVersion}</span>
				<span class="license">{dep.licenseType}</span>
			</li>
		{/each}
	</ul>
</Dialog>

<style>
	ul {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		list-style: none;
		border-radius: 0.5em;
		border: 1px solid var(--md-outline);
		height: 100%;
		overflow: auto;
	}

	hr {
		border-color: var(--md-outline);
	}

	li {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0.5rem 0.75rem;
	}

	.license {
		margin-left: auto;
	}

	@media only screen and (min-width: 1000px) {
		li {
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
		}
	}

	li:nth-child(2n) {
		background-color: var(--md-surface-variant);
	}

	li:last-child {
		border-bottom-right-radius: 0.5em;
		border-bottom-left-radius: 0.5em;
	}

	a {
		color: var(--md-on-background);
	}

	.version {
		font-size: 0.75rem;
		color: var(--md-on-surface-variant);
	}
</style>
