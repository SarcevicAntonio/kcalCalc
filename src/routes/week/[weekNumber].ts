import type { RequestHandler } from '@sveltejs/kit';
import { day } from '../day/_data';

export const get: RequestHandler = () => {
	return {
		status: 200,
		body: {
			data: {
				day: JSON.stringify(day),
			},
		},
	};
};
