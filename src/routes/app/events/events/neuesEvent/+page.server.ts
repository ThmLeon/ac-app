import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error as svelteError } from '@sveltejs/kit';
import { newEventSchema } from '@/schemas/newEventSchema';
import { zod } from 'sveltekit-superforms/adapters';
import {
	returnActionResult,
	returnCreateActionResultBoth,
	returnDeleteActionResultBoth
} from '@/utils/utils.server';
import {
	createNewEvent as createNewEventSupabase,
	getAllEventMasters
} from '@/server/supabase/events.server';
import { createNewEvent as createNewEventSharepoint } from '@/server/sharepoint/events.server';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(newEventSchema));
	const data = await getAllEventMasters();

	return { form, data };
};

export const actions: Actions = {
	createNewEvent: async ({ request }) => {
		const form = await superValidate(request, zod(newEventSchema));
		console.log('Anmeldeart' + form.data.Anmeldeart);

		return returnCreateActionResultBoth(
			form,
			() => createNewEventSharepoint(form.data),
			(id) => createNewEventSupabase(form.data, id),
			'Fehler beim Hinzufügen des Events',
			'Event erfolgreich hinzugefügt'
		);
	}
};
