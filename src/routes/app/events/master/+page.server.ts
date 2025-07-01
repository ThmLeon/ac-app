import type { Actions, PageServerLoad } from './$types';
import { fail, error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { data, error } = await supabase
		.from('04_events_master')
		.select('id, master_name, beschreibung')
		.order('master_name', { ascending: true });

	if (error || data.length === 0)
		svelteError(500, { message: 'Events Master konnten nicht geladen werden' });

	return { data };
};

export const actions: Actions = {
	deleteEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const eventId = formData.get('id');

		if (eventId == null) return { error: true };

		const { error } = await supabase.from('04_events_master').delete().eq('id', eventId.toString());

		if (error) return fail(500, { error: true, message: 'Fehler beim Löschen des Events Master' });

		return { success: true, message: 'Event Master erfolgreich gelöscht' };
	},

	updateEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		const eventId = formData.get('id');
		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');
		if (eventId == null || masterName == null || beschreibung == null) {
			return { error: true };
		}

		const { error } = await supabase
			.from('04_events_master')
			.update({ master_name: masterName.toString(), beschreibung: beschreibung.toString() })
			.eq('id', eventId.toString());

		if (error)
			return fail(500, { error: true, message: 'Fehler beim Aktualisieren des Events Master' });
		return { success: true, message: 'Event Master erfolgreich aktualisiert' };
	},

	addEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');

		if (masterName == null || beschreibung == null) return { error: true };

		const { error } = await supabase
			.from('04_events_master')
			.insert({ master_name: masterName.toString(), beschreibung: beschreibung.toString() });

		if (error)
			return fail(500, { error: true, message: 'Fehler beim Hinzufügen des Events Master' });

		return { success: true, message: 'Event Master erfolgreich hinzugefügt' };
	}
};
