<script>
	import { goto } from '$app/navigation';
	import messagesStore from '$lib/stores/massages.store.js';
	import Book from '$lib/components/Books/Book.svelte';

	export let data;
	async function back() {
		try {
			await goto(`/?page=${data.page - 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	}
	async function next() {
		try {
			console.log('here arrive');
			await goto(`/?page=${+data.page + 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Latest Books</h1>
		<h3>Page: {data.page}</h3>
	</div>
</div>
<ul>
	{#each data.books as book (book.id)}
		<li>
			<Book {book} />
		</li>
	{/each}
</ul>
<div class="row mt-3">
	<div class="col">
		<button on:click={back} disabled={!data.prev} class="btn btn-info w-100">Previous</button>
	</div>
	<div class="col">
		<button on:click={next} disabled={!data.next} class="btn btn-info w-100">Next</button>
	</div>
</div>
