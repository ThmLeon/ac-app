import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventMasterSchema } from '@/schemas/eventMasterSchema';
import {
	addEventMaster,
	deleteEventMaster,
	getAllEventMasters,
	updateEventMaster
} from '@/server/supabase/events.server';
import { returnActionResult } from '@/utils/utils.server';

export const load: PageServerLoad = async ({ locals }) => {
	const data = await getAllEventMasters();
	const form = await superValidate(zod(eventMasterSchema));
	return { data, form };
};

export const actions: Actions = {
	deleteEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnActionResult(
			form,
			() => deleteEventMaster(form.data.id),
			'Fehler beim Löschen des Events Master',
			'Event Master erfolgreich gelöscht'
		);
	},

	updateEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnActionResult(
			form,
			() => updateEventMaster(form.data),
			'Fehler beim Aktualisieren des Events Master',
			'Event Master erfolgreich aktualisiert'
		);
	},

	addEventMaster: async ({ request }) => {
		const form = await superValidate(request, zod(eventMasterSchema));

		return returnActionResult(
			form,
			() => addEventMaster(form.data),
			'Fehler beim Hinzufügen des Events Master',
			'Event Master erfolgreich hinzugefügt'
		);
	}
};
