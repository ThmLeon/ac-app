import type { LayoutServerLoad } from './$types';
import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import {
	getEventApplicationState,
	getEventDetailsById,
	getEventTitleImage,
	getNumberOfEventApplications
} from '@/server/supabase/events.server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventDeleteSchema } from '@/schemas/eventDeleteSchema';

export const load: LayoutServerLoad = async ({ locals, params, parent }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

	const eventData = await getEventDetailsById(Number(eventId));
	const applicationState = await getEventApplicationState(Number(eventId), userId);
	const totalApplications = await getNumberOfEventApplications(Number(eventId));
	const eventImageUrl = await getEventTitleImage(Number(eventId));
	const deleteForm = await superValidate({ ID: Number(eventId) }, zod(eventDeleteSchema));

	return {
		userId,
		eventData: eventData,
		applicationState: applicationState.length > 0 ? applicationState[0] : null,
		totalApplications,
		eventImageUrl,
		deleteForm
	};
};
