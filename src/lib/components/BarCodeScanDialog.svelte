<script lang="ts">
	import {
		BrowserCodeReader,
		BrowserMultiFormatOneDReader,
		type IScannerControls,
	} from '@zxing/browser'
	import { Dialog } from 'as-comps'
	import { createEventDispatcher, onMount } from 'svelte'
	import IcRoundBarcode from '~icons/ic/round-barcode'
	import IcRoundCameraswitch from '~icons/ic/round-cameraswitch'
	import IcRoundFlashlightOff from '~icons/ic/round-flashlight-off'
	import IcRoundFlashlightOn from '~icons/ic/round-flashlight-on'
	import IcRoundQrCodeScanner from '~icons/ic/round-qr-code-scanner'
	const dispatch = createEventDispatcher()

	let isOpen = false
	let codeReader = new BrowserMultiFormatOneDReader()
	let videoInputDevices: MediaDeviceInfo[] = []
	let selectedDeviceId: string
	let previewElem: HTMLVideoElement
	let controls: IScannerControls
	let isTorchOn = false

	onMount(async () => {
		videoInputDevices = await BrowserCodeReader.listVideoInputDevices()
		const possibleBackCam = videoInputDevices.find(d =>
			d.label.includes('back')
		)
		selectedDeviceId =
			possibleBackCam?.deviceId || videoInputDevices[0]?.deviceId
	})

	async function startScanner() {
		closeScanner()
		controls = await codeReader.decodeFromVideoDevice(
			selectedDeviceId,
			previewElem,
			result => {
				if (!result) return
				dispatch('scanned', result.getText())
				closeScanner()
				isOpen = false
			}
		)
	}

	function closeScanner() {
		controls?.stop()
		isTorchOn = false
		controls = undefined
	}

	function switchSelectedDevice() {
		let idx = videoInputDevices.findIndex(d => d.deviceId === selectedDeviceId)
		idx = (idx + 1) % videoInputDevices.length
		selectedDeviceId = videoInputDevices[idx].deviceId
		startScanner()
	}

	function toggleTorch() {
		controls.switchTorch(!isTorchOn)
		isTorchOn = !isTorchOn
	}
</script>

{#if videoInputDevices.length}
	<Dialog
		--as-dialog-height="max-content"
		--as-dialog-width="max-content"
		noCloseButton
		triggerProps={{ class: 'inline-btn tonal' }}
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
		{#if controls}
			<div class="controls">
				{#if videoInputDevices.length > 1}
					<button
						class="btn tonal"
						on:click={switchSelectedDevice}
					>
						<IcRoundCameraswitch />
					</button>
				{/if}
				{#if controls.switchTorch}
					<button
						class="btn tonal"
						on:click={toggleTorch}
					>
						{#if !isTorchOn}
							<IcRoundFlashlightOn />
						{:else}
							<IcRoundFlashlightOff />
						{/if}
					</button>
				{/if}
			</div>
		{/if}
	</Dialog>
{/if}

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

	.controls {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
