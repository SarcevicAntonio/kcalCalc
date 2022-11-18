import { sveltekit } from '@sveltejs/kit/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-svelte-console-remover'

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
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
		// mode === 'development' && basicSsl(),
	],
}))
