import { goto } from '$app/navigation';

export async function afterLogin(url, userId) {
	console.log(url, 'from helper');
	const route = url.searchParams.get('redirect') || '/';
	await setUser(usersId);
	await goto(route);
}
