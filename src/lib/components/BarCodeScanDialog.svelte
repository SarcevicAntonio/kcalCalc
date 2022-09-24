<script lang="ts">
	import {
		BrowserCodeReader,
		BrowserMultiFormatOneDReader,
		type IScannerControls,
	} from '@zxing/browser';
	import { Dialog } from 'as-comps';
	import { createEventDispatcher } from 'svelte';
	import IcRoundBarcode from '~icons/ic/round-barcode';
	const dispatch = createEventDispatcher();

	let isOpen = false;

	let codeReader: BrowserMultiFormatOneDReader;
	let videoInputDevices: MediaDeviceInfo[];
	let selectedDeviceId: string;
	let previewElem: HTMLVideoElement;
	let controls: IScannerControls;

	async function startScanner() {
		codeReader = new BrowserMultiFormatOneDReader();
		videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
		selectedDeviceId = videoInputDevices[0].deviceId;
		console.log(`Started decode from camera with id ${selectedDeviceId}`);
		controls = await codeReader.decodeFromVideoDevice(selectedDeviceId, previewElem, (result) => {
			if (!result) return;
			console.log('RESULT: ', result, typeof result);
			dispatch('scanned', result.getText());
			closeScanner();
			isOpen = false;
		});
	}

	function closeScanner() {
		if (!controls) return;
		controls.stop();
	}
</script>

<Dialog triggerClass="btn tonal" on:introend={startScanner} on:dismiss={closeScanner} bind:isOpen>
	<svelte:fragment slot="trigger-label">
		<IcRoundBarcode />
	</svelte:fragment>
	<video bind:this={previewElem}>
		<track kind="captions" />
	</video>
</Dialog>
