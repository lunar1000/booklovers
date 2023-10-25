<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import messagesStore from '$lib/stores/massages.store';
	import '$lib/firebase/firebase.client';
	import { onMount } from 'svelte';
	import { sendJWToken } from '$lib/firebase/auth.client';
	/**
	 * @type {string | number | NodeJS.Timeout | undefined}
	 */
	let timerId;
	async function sendServerToken() {
		try {
			await sendJWToken();
		} catch (e) {
			clearInterval(timerId);
		}
	}
	// @ts-ignore
	onMount(async () => {
		try {
			await sendServerToken();
			timerId = setInterval(async () => {
				await sendServerToken();
			}, 600000);
		} catch (e) {
			console.log(e);
			messagesStore.showError();
		}
		return () => {
			clearInterval(timerId);
		};
	});
	function closeMessage() {
		messagesStore.hide();
	}
</script>

<Nav />
<main class="container">
	{#if $messagesStore.show}
		<div class="row mt-3">
			<div class="col">
				<div
					class:alert-danger={$messagesStore.type === 'error'}
					class:alert-success={$messagesStore.type === 'success'}
					class="alert alert-dismissible"
					role="alert"
				>
					<strong>{$messagesStore.type === 'error' ? 'Error' : 'Success'}:</strong>
					{$messagesStore.message}
					<button on:click={closeMessage} type="button" class="btn-close" aria-label="Close" />
				</div>
			</div>
		</div>
	{/if}
	<slot />
</main>
