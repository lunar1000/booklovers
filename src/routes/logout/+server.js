import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	cookies.delete('jwt');
	return json({ message: 'success' }, { status: 200 });
}
