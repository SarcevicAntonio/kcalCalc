/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#the-app-namespace
// for information about these interfaces
declare namespace App {
	interface Locals {
		token: DecodedIdToken;
	}
	// interface Platform {}
	interface Session {
		user: User
	}
	// interface Stuff {}
}
