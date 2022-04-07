import { createSessionCookie, verifyToken } from '$lib/firebase/admin';
import type { RequestHandler } from '@sveltejs/kit';

const ONE_WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export const post: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const [scheme, token] = authHeader.split(' ');
	if (scheme !== 'Bearer' || !token) {
		return { status: 401, body: 'Invalid auth header' };
	}

	try {
		const { sub, email } = await verifyToken(token);

		const user = { id: sub, email };

		const sessionCookie = await createSessionCookie(token, ONE_WEEK_IN_SECONDS);

		return {
			status: 200,
			body: user,
			headers: {
				'Set-Cookie': sessionCookie,
			},
		};
	} catch {
		return { status: 401, body: 'Invalid auth header' };
	}
};

const expiredCookie = `session=; SameSite=Strict; Path=/; HttpOnly; Max-Age=0;`;

export const del: RequestHandler = async () => {
	return {
		status: 200,
		headers: {
			Location: '/success',
			'Set-Cookie': expiredCookie,
		},
	};
};
