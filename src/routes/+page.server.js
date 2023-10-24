import { db } from '$lib/firebase/firebase.server';

export async function load() {
	const count = await db.collection('users').count().get();
	console.log('서버스크립트가 먼저겠지');
	return {
		count: count.data().count
	};
}
