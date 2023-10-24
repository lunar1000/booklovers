import { getAuth } from 'firebase/auth';

export async function load({ data }) {
	console.log('서버스크립트랑 클라이언트 스크립트랑 같이 데이터를 반환하면 어떻게 대');
	// const token = await getAuth().currentUser?.getIdToken(true);
	return {
		...data,
		abc: 100
	};
}
