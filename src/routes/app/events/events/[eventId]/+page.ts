import type { PageLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const eventId = params.eventId;
	const { data, error } = await supabase
		.from('04_events_events')
		.select(
			`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt,
                    event_master:04_events_master(master_name),
                    event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
		)
		.eq('id', eventId)
		.single();

	if (error || !data) svelteError(500, { message: 'Event not found' });

	return { eventData: data };
};
