import { writable } from 'svelte/store';
import { PUBLIC_ERROR_MESSAGE } from '$env/static/public';

const messagesStore = writable({ show: false, message: '', type: 'error' });

export default {
	subscribe: messagesStore.subscribe,
	showError: function (message = PUBLIC_ERROR_MESSAGE) {
		messagesStore.set({ show: true, message, type: 'error' });
	},
	showSuccess: function (message) {
		messagesStore.set({ show: true, message, type: 'success' });
	},
	hide: function () {
		messagesStore.set({ show: false, message: '', type: 'success' });
	}
};
