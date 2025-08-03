import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { PageServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';
import { getAllEvents } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = throwMissingErrorIfNeeded(locals.user?.id);

	const data = await getAllEvents(userId);

	return { data };
};
