import { readable } from 'svelte/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default readable({ isActive: false, isLoggedIn: false, userId: '' }, (set) => {
	if (typeof window !== undefined) {
		//클라이언트이면~
		onAuthStateChanged(getAuth(), (user) => {
			if (user) {
				set({ isActive: true, isLoggedIn: true, userId: user.uid });
			} else {
				set({ isActive: true, isLoggedIn: false, userId: '' });
			}
		});
	}
});
