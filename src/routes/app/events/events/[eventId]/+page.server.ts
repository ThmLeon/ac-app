import type { PageServerLoad } from './$types';
import { fail, error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = params.eventId;
	const { supabase } = locals;
	const userId = (await locals.safeGetSession()).user?.id;

	if (!eventId || !userId) {
		throw svelteError(400, { message: 'Fehler in den Daten' });
	}

	const { data: eventData, error: eventError } = await supabase
		.from('04_events_events')
		.select(
			`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt,
             event_master:04_events_master(master_name),
             event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
		)
		.eq('id', eventId)
		.single();

	if (eventError || !eventData) {
		throw svelteError(500, { message: 'Event not found' });
	}

	const { data: alreadyApplied, error: alreadyAppliedError } = await supabase
		.from('04_events_bewerbungen')
		.select('id')
		.eq('event_id', eventId)
		.eq('mitglied_id', userId);

	if (alreadyAppliedError) {
		throw svelteError(500, { message: 'Fehler beim laden der Bewerbungen' });
	}

	return {
		eventData: eventData,
		alreadyApplied: alreadyApplied.length != 0
	};
};
