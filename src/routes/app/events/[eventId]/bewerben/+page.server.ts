import {
	returnCreateActionResultBoth,
	returnDeleteActionResultBoth,
	returnUpdateActionResultBoth,
	throwMissingErrorIfNeeded
} from '@/utils/utils.server';
import type { Actions, PageServerLoad } from './$types';
import {
	createEventApplication as createEventApplicationSupabase,
	deleteEventApplication as deleteEventApplicationSupabase,
	updateEventApplication as updateEventApplicationSupabase,
	getEventApplicationState,
	getEventDetailsById,
	getNumberOfEventApplications
} from '@/server/supabase/events.server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { eventBewerbungSchema } from '@/schemas/eventBewerbungSchema';
import {
	createEventApplication as createEventApplicationSharepoint,
	deleteEventApplication as deleteEventApplicationSharepoint,
	updateEventApplication as updateEventApplicationSharepoint
} from '@/server/sharepoint/events.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));
	const form = await superValidate(zod(eventBewerbungSchema));

	const eventData = await getEventDetailsById(Number(eventId));
	const applicationState = await getEventApplicationState(Number(eventId), userId);
	const totalApplications = await getNumberOfEventApplications(Number(eventId));

	return {
		form,
		eventData: eventData,
		applicationState: applicationState.length > 0 ? applicationState[0] : null,
		totalApplications
	};
};

export const actions: Actions = {
	sendApplication: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(eventBewerbungSchema));
		const userTitel =
			throwMissingErrorIfNeeded(locals.userDetails?.Vorname) +
			' ' +
			throwMissingErrorIfNeeded(locals.userDetails?.Nachname);
		const eventId = Number(throwMissingErrorIfNeeded(params.eventId));
		const userId = Number(throwMissingErrorIfNeeded(locals.userDetails?.ID));

		return returnCreateActionResultBoth(
			form,
			() => createEventApplicationSharepoint(form.data, userTitel, eventId, userId),
			(id) => createEventApplicationSupabase(form.data, id, userTitel, eventId, userId),
			'Fehler bei der Bewerbung',
			'Bewerbung erfolgreich gesendet'
		);
	},
	deleteApplication: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(eventBewerbungSchema));
		return returnDeleteActionResultBoth(
			form,
			() => deleteEventApplicationSharepoint(form.data.ID),
			() => deleteEventApplicationSupabase(form.data.ID),
			'Fehler beim Löschen der Bewerbung',
			'Bewerbung erfolgreich gelöscht'
		);
	},
	updateApplication: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(eventBewerbungSchema));
		return returnUpdateActionResultBoth(
			form,
			() => updateEventApplicationSharepoint(form.data),
			() => updateEventApplicationSupabase(form.data),
			'Fehler beim Aktualisieren der Bewerbung',
			'Bewerbung erfolgreich aktualisiert'
		);
	}
};
