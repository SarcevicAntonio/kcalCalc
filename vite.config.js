import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import removeConsole from 'vite-plugin-svelte-console-remover';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit({
			experimental: {
				inspector: true,
			},
		}),
		Icons({
			compiler: 'svelte',
		}),
		removeConsole(),
	],
};

export default config;
