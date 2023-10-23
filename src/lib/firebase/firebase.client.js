import {
	PUBLIC_API_KEY,
	PUBLIC_AUTH_DOMAIN,
	PUBLIC_PROJECT_ID,
	PUBLIC_STORAGE_BUCKET,
	PUBLIC_API_ID,
	PUBLIC_MEASUREMENT_ID,
	PUBLIC_MESSAGE_SENDER_ID
} from '$env/static/public';

// svelte 4에서 svetle/internal 모듈이 제공되지 않는다. 일단 방법을 찾는 중
// window 개체 유무를 확인하여 구분할 수 있다
const is_client = (() => {
	return typeof window !== 'undefined' ? true : false;
})();

import { getFirestore } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: PUBLIC_API_KEY,
	authDomain: PUBLIC_AUTH_DOMAIN,
	projectId: PUBLIC_PROJECT_ID,
	storageBucket: PUBLIC_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_MESSAGE_SENDER_ID,
	appId: PUBLIC_API_ID,
	measurementId: PUBLIC_MEASUREMENT_ID
};

if (getApps().length == 0) {
	const app = initializeApp(firebaseConfig);
	if (is_client) {
		getAnalytics(app); /* 윈도우 오브젝트를 참조하기 때문에 서버에서 실행되면 오류가 발생한다 */
	}
}

export const db = getFirestore();
