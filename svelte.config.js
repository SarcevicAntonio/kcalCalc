import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';
import removeConsole from 'vite-plugin-svelte-console-remover';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	experimental: {
		inspector: true,
	},
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
			typescript: true,
		}),
	],

	kit: {
		adapter: adapter(),
		vite: {
			plugins: [
				Icons({
					compiler: 'svelte',
				}),
				removeConsole(),
			],
		},
	},
};

export default config;
