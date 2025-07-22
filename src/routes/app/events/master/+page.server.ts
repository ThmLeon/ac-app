import type { Actions, PageServerLoad } from './$types';
import { fail, error as svelteError, defer } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventMasterSchema } from '@/schemas/eventMaster';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	const eventMasters = supabase
		.from('04_events_master')
		.select('id, master_name, beschreibung')
		.order('master_name', { ascending: true })
		.then(({ data, error }) => {
			if (error || !data || data.length === 0) {
				throw svelteError(500, {
					message: 'Events Master konnten nicht geladen werden'
				});
			}
			return data;
		});

	const form = await superValidate(zod(eventMasterSchema));

	return defer({ eventMasters, form });
};

export const actions: Actions = {
	deleteEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const form = await superValidate(request, zod(eventMasterSchema));

		if (!form.valid || !form.data.id) return fail(400, { form });

		const { error } = await supabase.from('04_events_master').delete().eq('id', form.data.id);

		if (error) return message(form, 'Fehler beim Löschen des Events Master', { status: 500 });

		return message(form, 'Event Master erfolgreich gelöscht');
	},

	updateEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const form = await superValidate(request, zod(eventMasterSchema));

		if (!form.valid || !form.data.id) return fail(400, { form });

		const { error } = await supabase
			.from('04_events_master')
			.update({
				master_name: form.data.master_name,
				beschreibung: form.data.beschreibung
			})
			.eq('id', form.data.id);

		if (error) return message(form, 'Fehler beim Aktualisieren des Events Master', { status: 500 });
		return message(form, 'Event Master erfolgreich aktualisiert');
	},

	addEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const form = await superValidate(request, zod(eventMasterSchema));

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.from('04_events_master').insert({
			master_name: form.data.master_name,
			beschreibung: form.data.beschreibung
		});

		if (error) return message(form, 'Fehler beim Hinzufügen des Events Master', { status: 500 });

		return message(form, 'Event Master erfolgreich hinzugefügt');
	}
};
