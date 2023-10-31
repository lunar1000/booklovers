<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import messagesStore from '$lib/stores/massages.store';
	import '$lib/firebase/firebase.client';
	import { onDestroy, onMount } from 'svelte';
	import { sendJWToken } from '$lib/firebase/auth.client';
	import authStore from '$lib/stores/auth.store.js';
	import bookNotifyStore from '$lib/stores/book-notify.store.js';

	let notifyBook = false;

	const unsub = bookNotifyStore.subscribe((book) => {
		if (!$authStore.isLoggedIn) {
			notifyBook = book;
			return;
		}
		if ($authStore.userId !== book.user_id) {
			notifyBook = book;
			return;
		}
	});
	onDestroy(() => {
		unsub();
	});

	export let data;
	let isLoggedIn = data.isLoggedIn;

	$: isLoggedIn = $authStore.isActive ? $authStore.isLoggedIn : data.isLoggedIn;

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
	function closeAlert() {
		notifyBook = null;
	}
</script>

<Nav {isLoggedIn} />
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
	{#if (() => {
		console.log(notifyBook);
		return notifyBook;
	})()}
		<div
			class="toast show position-fixed top-0 end-0 m-3"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="toast-header">
				<strong class="me-auto">New Book</strong>
				<button
					on:click={closeAlert}
					type="button"
					class="btn-close"
					data-bs-dismiss="toast"
					aria-label="Close"
				/>
			</div>
			<div class="toast-body">
				Book <a href={notifyBook.id}>{notifyBook.title}</a> just created!!
			</div>
		</div>
	{/if}
</main>
