import { returnActionResult, throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { Actions, PageServerLoad } from './$types';
import { getAllEventsPaginated } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ url, locals }: Parameters<PageServerLoad>[0]) => {
	/*const userId = throwMissingErrorIfNeeded(locals.userDetails?.ID);
	const skip = 0;
	const limit = 10;

	const data = await getAllEventsPaginated(userId, skip, limit, '');

	return { data };*/
};
