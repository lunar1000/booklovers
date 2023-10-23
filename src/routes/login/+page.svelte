<script>
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
	import { loginWithEmailandPassword } from '$lib/firebase/auth.client';
	import { afterLogin } from '$lib/helpers/route.helper';
	import messagesStore from '$lib/stores/massages.store';
	import { page } from '$app/stores';

	async function onLogin(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			const password = formData.get('password');
			const user = await loginWithEmailandPassword(email, password);
			await afterLogin($page.url);
		} catch (e) {
			console.log(e.code);
			if (
				// 'auth/invalid-login-credentials', 코드만 반환된다. 네트워크 장애로 구글에 연결되지 않을 때 다른 오류가 예상된다. 하지만 로그인과 관련된 부가 단서를 제공하는 에러 메시지는 감추어져 있다.
				[
					'auth/invalid-login-credentials',
					'auth/invalid-email',
					'auth/user-not-found',
					'auth/wrong-password'
				].includes(e.code)
			) {
				messagesStore.showError('Invalid email or password');
				return;
			}
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Login</h1>
	</div>
</div>
<hr />
<AuthForm on:submit={onLogin} btnName="Login" />
<hr />
<LoginWithGoogle />
<hr />
<div class="row">
	<div class="col">
		<a href="/forgot-password" class="btn btn-warning w-100">Forgot Password</a>
	</div>
</div>

<svelte:head>
	<title>Book Lovers -Login</title>
</svelte:head>
