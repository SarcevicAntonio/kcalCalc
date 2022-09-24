<script lang="ts">
	import {
		BrowserCodeReader,
		BrowserMultiFormatOneDReader,
		type IScannerControls,
	} from '@zxing/browser';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcRoundBarcode from '~icons/ic/round-barcode';
	import IcRoundQrCodeScanner from '~icons/ic/round-qr-code-scanner';
	const dispatch = createEventDispatcher();

	let isOpen = false;
	let codeReader = new BrowserMultiFormatOneDReader();
	let videoInputDevices: MediaDeviceInfo[];
	let selectedDeviceId: string;
	let previewElem: HTMLVideoElement;
	let controls: IScannerControls;

	async function startScanner() {
		closeScanner();
		videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
		selectedDeviceId = videoInputDevices[0].deviceId;
		controls = await codeReader.decodeFromVideoDevice(selectedDeviceId, previewElem, (result) => {
			if (!result) return;
			dispatch('scanned', result.getText());
			closeScanner();
			isOpen = false;
		});
	}

	function closeScanner() {
		controls?.stop();
		controls = undefined;
	}
</script>

<Dialog
	noCloseButton
	triggerClass="inline-btn tonal"
	on:introend={startScanner}
	on:dismiss={closeScanner}
	bind:isOpen
>
	<svelte:fragment slot="trigger-label">
		<IcRoundBarcode />
	</svelte:fragment>
	{#if !controls}
		<div class="init">
			<IcRoundQrCodeScanner />
			<span>Initializing Scanner...</span>
		</div>
	{/if}
	<video
		bind:this={previewElem}
		height={!controls ? 0 : undefined}
		width={!controls ? 0 : undefined}
	>
		<track kind="captions" />
	</video>
</Dialog>

<style>
	video {
		max-width: 100%;
		max-height: 100%;
		border-radius: 1000000;
	}

	.init {
		color: var(--md-on-surface);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25em;
		font-size: 3rem;
	}

	.init span {
		font-size: 1rem;
	}
</style>
