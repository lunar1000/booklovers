import admin from 'firebase-admin';
import { GOOGLE_SERVICE_ACCOUNT } from '$env/static/private';
// import GOOGLE_SERVICE_ACCOUNT from './a.json';
if (admin.apps.length === 0) {
	admin.initializeApp({
		// @ts-ignore
		credential: admin.credential.cert(JSON.parse(GOOGLE_SERVICE_ACCOUNT))
	});
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
