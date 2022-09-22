<script lang="ts">
	import { Dialog } from 'as-comps';
	import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
	import { createEventDispatcher } from 'svelte';
	import IcRoundBarcode from '~icons/ic/round-barcode';
	const dispatch = createEventDispatcher();

	let isOpen = false;
	let html5QrcodeScanner: Html5QrcodeScanner;

	function onScanSuccess(decodedText, decodedResult) {
		// handle the scanned code as you like, for example:
		console.log(`Code matched = ${decodedText}`, decodedResult);
		closeScanner();
		isOpen = false;
		dispatch('scan', decodedText);
	}

	function onScanFailure(error) {
		// handle scan failure, usually better to ignore and keep scanning.
		// for example:
		// console.warn(`Code scan error = ${error}`);
	}

	function startScanner() {
		html5QrcodeScanner = new Html5QrcodeScanner(
			'reader',
			{
				fps: 10,
				qrbox: { width: 250, height: 250 },
				supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
				experimentalFeatures: {
					// useBarCodeDetectorIfSupported: true,
				},
			},
			false
		);

		html5QrcodeScanner.render(onScanSuccess, onScanFailure);
	}

	function closeScanner() {
		html5QrcodeScanner.clear();
	}
</script>

<Dialog triggerClass="btn tonal" on:introstart={startScanner} on:dismiss={closeScanner} bind:isOpen>
	<svelte:fragment slot="trigger-label">
		<IcRoundBarcode />
	</svelte:fragment>
	<div style="width: 500px" id="reader" />
</Dialog>
