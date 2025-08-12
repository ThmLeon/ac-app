import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { PageServerLoad } from './$types';
import {
	getEventApplicationState,
	getEventDetailsById,
	getNumberOfEventApplications
} from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

	const eventData = await getEventDetailsById(Number(eventId));
	const applicationState = await getEventApplicationState(Number(eventId), userId);
	const totalApplications = await getNumberOfEventApplications(Number(eventId));

	return {
		eventData: eventData,
		applicationState: applicationState.length > 0 ? applicationState[0] : null,
		totalApplications
	};
};
