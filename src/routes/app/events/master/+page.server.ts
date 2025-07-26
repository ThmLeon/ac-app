import type { Actions, PageServerLoad } from './$types';
import { fail, error as svelteError } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventMasterSchema } from '@/schemas/eventMaster';
import {
	addEventMaster,
	deleteEventMaster,
	getAllEventMasters,
	updateEventMaster
} from '@/server/database/events.server';
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
