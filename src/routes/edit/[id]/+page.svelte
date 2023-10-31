<script>
	import BookForm from '$lib/components/Books/BookForm.svelte';

	export let form;
	export let data;
	let book = data.book;
</script>

<BookForm form={{ ...book, ...form }} />
