import { json } from '@sveltejs/kit';

export async function GET() {
	console.log('about get');
	return json({ message: 'success' }, { status: 200 });
}
