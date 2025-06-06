import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { supabase } = locals;
	const { eventId } = params; // Access the eventId from the dynamic route

	// Example usage: Fetch event details using eventId
	const { data, error } = await supabase
		.from('04_events_events')
		.select(
			`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt,
            event_master:04_events_master(master_name),
            event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
		)
		.eq('id', eventId)
		.single();

	if (error) return { data: null, error: true };
	return { data: data, error: false };
};

export const actions: Actions = {};
