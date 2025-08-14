import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';
import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import {
	getEventApplicationState,
	getEventDetailsById,
	getNumberOfEventApplications
} from '@/server/supabase/events.server';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

	const eventData = await getEventDetailsById(Number(eventId));
	const applicationState = await getEventApplicationState(Number(eventId), userId);
	const totalApplications = await getNumberOfEventApplications(Number(eventId));

	return {
		userId,
		eventData: eventData,
		applicationState: applicationState.length > 0 ? applicationState[0] : null,
		totalApplications
	};
};
