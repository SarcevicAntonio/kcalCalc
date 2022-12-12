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
	<h3 class="headline-4">Third-Party Dependencies:</h3>
	<ul>
		{#each deps as dep, i}
			{@const link = dep.link.replace('git://', 'https://').replace('git+', '')}
			<li class:odd={i % 2}>
				<span>
					<a target="_blank" rel="noreferrer" href={link}>{dep.name}</a>
					<span class="version">@ {dep.installedVersion}</span>
				</span>
				<span>{dep.licenseType}</span>
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
		border-radius: 1em;
		border: 1px solid var(--md-on-background);
	}

	li {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
	}

	a {
		color: var(--md-on-background);
	}

	.odd {
		background-color: var(--md-surface-variant);
	}

	.version {
		font-size: 0.75rem;
		color: var(--md-on-surface-variant);
	}
</style>
