import { returnDeleteActionResultBoth, throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { Actions, PageServerLoad } from './$types';
import {
	getEventApplicationState,
	getEventDetailsById,
	getNumberOfEventApplications,
	deleteEvent as deleteEventSupabase
} from '@/server/supabase/events.server';
import { deleteEvent as deleteEventSharepoint } from '@/server/sharepoint/events.server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventDeleteSchema } from '@/schemas/eventDeleteSchema';

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

export const actions: Actions = {
	deleteEvent: async ({ request }) => {
		const form = await superValidate(request, zod(eventDeleteSchema));
		return returnDeleteActionResultBoth(
			form,
			() => deleteEventSharepoint(form.data.ID),
			() => deleteEventSupabase(form.data.ID),
			'Fehler beim Löschen des Events',
			'Event erfolgreich gelöscht'
		);
	}
};
