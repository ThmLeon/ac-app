import {
	returnCreateActionResultBoth,
	returnDeleteActionResultBoth,
	returnUpdateActionResultBoth,
	throwMissingErrorIfNeeded
} from '@/utils/utils.server';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	getEventApplications,
	setEventBesetzungAnwesenheit as setEventBesetzungAnwesenheitSupabase
} from '@/server/supabase/events.server';
import { setEventBesetzungAnwesenheit as setEventBesetzungAnwesenheitSharepoint } from '@/server/sharepoint/events.server';
import { eventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const eventApplications = await getEventApplications(Number(eventId));
	const form = await superValidate(zod(eventBesetzungAnwesenheitSchema));

	return {
		eventApplications,
		eventId,
		form
	};
};

export const actions: Actions = {
	setBesetztAnwesend: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(eventBesetzungAnwesenheitSchema));
		return returnUpdateActionResultBoth(
			form,
			() => setEventBesetzungAnwesenheitSharepoint(form.data),
			() => setEventBesetzungAnwesenheitSupabase(form.data),
			'Fehler bei der Änderung der Besetzung/Anwesenheit',
			'Erfolgreich Besetzung/Anwesenheit geändert'
		);
	}
};
