import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventMasterSchema } from '@/schemas/eventMasterSchema';
import {
	addEventMaster as addEventMasterSupabase,
	getAllEventMasters,
	deleteEventMaster as deleteEventMasterSupabase,
	updateEventMaster as updateEventMasterSupabase
} from '@/server/supabase/events.server';
import {
	returnCreateActionResultBoth,
	returnDeleteActionResultBoth,
	returnUpdateActionResultBoth
} from '@/utils/utils.server';
import {
	addEventMaster as addEventMasterSharepoint,
	deleteEventMaster as deleteEventMasterSharepoint,
	updateEventMaster as updateEventMasterSharepoint
} from '@/server/sharepoint/events.server';

export const load: PageServerLoad = async ({ locals }) => {
	const data = await getAllEventMasters();
	const form = await superValidate(zod(eventMasterSchema));
	return { data, form };
};

export const actions: Actions = {
	deleteEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnDeleteActionResultBoth(
			form,
			() => deleteEventMasterSharepoint(form.data.ID),
			() => deleteEventMasterSupabase(form.data.ID),
			'Fehler beim Löschen des Events Master',
			'Event Master erfolgreich gelöscht'
		);
	},

	updateEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnUpdateActionResultBoth(
			form,
			() => updateEventMasterSharepoint(form.data),
			() => updateEventMasterSupabase(form.data),
			'Fehler beim Aktualisieren des Events Master',
			'Event Master erfolgreich aktualisiert'
		);
	},

	addEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnCreateActionResultBoth(
			form,
			() => addEventMasterSharepoint(form.data),
			(id) => addEventMasterSupabase(form.data, id),
			'Fehler beim Hinzufügen des Events Master',
			'Event Master erfolgreich hinzugefügt'
		);
	}
};
