import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';

export async function getAllEventMasters() {
	let { data, error } = await supabaseServerClient()
		.from('04_events_master')
		.select('id, master_name, beschreibung')
		.order('master_name', { ascending: true });

	data = throwFetchErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	return data;
}

export async function deleteEventMaster(id: string) {
	const { error } = await supabaseServerClient().from('04_events_master').delete().eq('id', id);
	return error;
}

export async function updateEventMaster(formData: EventMasterForm) {
	const { error } = await supabaseServerClient()
		.from('04_events_master')
		.update({
			master_name: formData.master_name,
			beschreibung: formData.beschreibung
		})
		.eq('id', formData.id);
	return error;
}

export async function addEventMaster(formData: EventMasterForm) {
	const { error } = await supabaseServerClient().from('04_events_master').insert({
		master_name: formData.master_name,
		beschreibung: formData.beschreibung
	});
	return error;
}

export async function createNewEvent(formData: NewEventForm) {
	const { error } = await supabaseServerClient()
		.from('04_events_events')
		.insert({
			...formData,
			start_datum_zeit: formData.start_datum_zeit.toISOString(),
			ende_datum_zeit: formData.ende_datum_zeit.toISOString(),
			bewerbungs_deadline: formData.bewerbungs_deadline.toISOString()
		});
	return error;
}

export async function getAllEvents(userId: string) {
	let { data, error } = await supabaseServerClient()
		.from('04_events_events')
		.select(
			`id, event_master_id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, 
			event_master:04_events_master(master_name),
			event_bewerbung:04_events_bewerbungen(id, mitglied_id, besetzt, anwesend)
			`
		)
		.eq('event_bewerbung.mitglied_id', userId);

	data = throwFetchErrorIfNeeded(data, error, 'Events konnten nicht geladen werden');
	return data;
}

export async function getEventDetailsById(eventId: string) {
	let { data, error } = await supabaseServerClient()
		.from('04_events_events')
		.select(
			`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt, anhang_benoetigt, anhang_beschreibung, bewerbungstext_benoetigt, bewerbungstext_beschreibung,
             event_master:04_events_master(master_name),
             event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
		)
		.eq('id', eventId)
		.single();

	data = throwFetchErrorIfNeeded(data, error, 'Event konnte nicht geladen werden');
	return data;
}

export async function getEventApplicationState(eventId: string, userId: string) {
	let { data, error } = await supabaseServerClient()
		.from('04_events_bewerbungen')
		.select('id, besetzt, anwesend')
		.eq('event_id', eventId)
		.eq('mitglied_id', userId);

	data = throwFetchErrorIfNeeded(data, error, 'Bewerbungsstatus konnte nicht geladen werden');
	return data;
}
