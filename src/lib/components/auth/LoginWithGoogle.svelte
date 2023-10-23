<script>
	import { page } from '$app/stores';
	import { loginWithGoogle } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/massages.store';
	async function loginGoogle() {
		try {
			const user = await loginWithGoogle();
			await afterLogin($page.url);
		} catch (e) {
			if (e.code === 'auth/popup-closed-by-user') {
				return;
			} /* 반응이 굼뜨다 로그인 되지 않고 팝업이 닫혔음을 구글에서 처리해서 전달해주는 건가?*/
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<button on:click={loginGoogle} class="btn btn-primary w-100"> Login With Google </button>
	</div>
</div>
