<script>
	import Book from '$lib/components/Books/Book.svelte';

	export let data;
	function refresh(e) {
		data.books = data.books.filter((v) => v.id !== e.detail.id);
	}
</script>

{#each data.books as book (book.id)}
	<Book {book} on:toggle_like={refresh} />
{/each}
