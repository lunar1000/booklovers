<script>
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import { mailResetPasswordEmail } from '$lib/firebase/auth.client';
	import messagesStore from '$lib/stores/massages.store';

	let hideForm = false;
	async function onForgotPassword(e) {
		try {
			const formData = new FormData(e.target);
			const email = formData.get('email');
			await mailResetPasswordEmail(email);
			hideForm = true;
			messagesStore.showSuccess('Reset Password Email Sent!');
		} catch (e) {
			`오류는 반환되지 않는다, 등록되 이메일인지 유출되지 않게 하기 위해	`;
			if (e.code === 'auth/invalid-email') {
				messagesStore.showSuccess('이메일을 확인해주세요');
			}
			console.log(e.code);
		}
	}
</script>

<div class="row">
	<div class="col">
		<h1>Forgot Password</h1>
	</div>
</div>

{#if !hideForm}
	<AuthForm on:submit={onForgotPassword} forgotPassword={true} btnName="forgot Password" />
{/if}
<svelte:head>
	<title>Book Lovers - Forgot Password</title>
</svelte:head>
