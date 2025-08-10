import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { PageServerLoad } from './$types';
import { getEventApplicationState, getEventDetailsById } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = Number(throwMissingErrorIfNeeded(params.eventId));
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

	const eventData = await getEventDetailsById(eventId);
	const applicationState = await getEventApplicationState(eventId, userId);

	return {
		eventData: eventData,
		alreadyApplied: applicationState
	};
};
