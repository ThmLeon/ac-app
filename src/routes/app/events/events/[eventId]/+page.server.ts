import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { PageServerLoad } from './$types';
import { fail, error as svelteError } from '@sveltejs/kit';
import { getEventApplicationState, getEventDetailsById } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = throwMissingErrorIfNeeded(locals.user?.id);

	const eventData = await getEventDetailsById(eventId);
	const applicationState = await getEventApplicationState(eventId, userId);

	return {
		eventData: eventData,
		alreadyApplied: applicationState
	};
};
