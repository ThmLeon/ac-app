import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

	return {
		userId
	};
};
