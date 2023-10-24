<script>
	import { onMount } from 'svelte';
	import { getAuth } from 'firebase/auth';
	export let data;

	onMount(async () => {
		try {
			const token = await getAuth().currentUser?.getIdToken(true);
			console.log(token, 'jwt');
		} catch (e) {
			console.log(e);
		}
	});
</script>

<h1>Num of users: {data.count}</h1>
<div>{data.abc}</div>
