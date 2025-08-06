/*import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error as svelteError } from '@sveltejs/kit';
import { newEventSchema } from '@/schemas/newEventSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { returnActionResult } from '@/utils/utils.server';
import { createNewEvent } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(newEventSchema));
	return { form };
};

export const actions: Actions = {
	createNewEvent: async ({ request }) => {
		const form = await superValidate(request, zod(newEventSchema));
		return returnActionResult(
			form,
			() => createNewEvent(form.data),
			'Fehler beim Erstellen des Events',
			'Event erfolgreich erstellt'
		);
	}
};
*/
