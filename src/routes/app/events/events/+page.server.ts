import type { PageServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const userId = (await locals.safeGetSession()).user?.id;
	if (!userId) {
		svelteError(400, { message: 'Fehler in den Daten' });
	}

	const { data, error } = await supabase
		.from('04_events_events')
		.select(
			`id, event_master_id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, 
			event_master:04_events_master(master_name),
			event_bewerbung:04_events_bewerbungen(id, mitglied_id, besetzt, anwesend)
			`
		)
		.eq('event_bewerbung.mitglied_id', userId);

	if (error || data.length === 0)
		svelteError(500, { message: 'Events konnten nicht geladen werden' });
	return { eventsData: data };
};
