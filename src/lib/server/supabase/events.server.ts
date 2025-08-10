import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';
import { fail, error as svelteError } from '@sveltejs/kit';
import type { FilterEventsSchema } from '@/schemas/filterEventsSchema';

export async function getAllEventMasters() {
	let { data, error } = await supabaseServerClient()
		.from('4_EventMaster')
		.select('ID, Titel, MasterBeschreibung, Eventart')
		.order('Eventart', { ascending: true });
	data = throwFetchErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	return data;
}

export async function deleteEventMaster(id: number) {
	const { error } = await supabaseServerClient().from('4_EventMaster').delete().eq('ID', id);
	return error;
}

export async function updateEventMaster(formData: EventMasterForm) {
	const { error } = await supabaseServerClient()
		.from('4_EventMaster')
		.update({
			Titel: formData.Titel,
			MasterBeschreibung: formData.MasterBeschreibung,
			Eventart: formData.Eventart
		})
		.eq('ID', formData.ID);
	return error;
}

export async function addEventMaster(formData: EventMasterForm, id: number) {
	const { error } = await supabaseServerClient().from('4_EventMaster').insert({
		ID: id,
		Titel: formData.Titel,
		MasterBeschreibung: formData.MasterBeschreibung,
		Eventart: formData.Eventart
	});
	return error;
}

export async function createNewEvent(formData: NewEventForm) {
	/*const { error } = await supabaseServerClient()
		.from('04_events_events')
		.insert({
			...formData,
			start_datum_zeit: formData.start_datum_zeit.toISOString(),
			ende_datum_zeit: formData.ende_datum_zeit.toISOString(),
			bewerbungs_deadline: formData.bewerbungs_deadline.toISOString()
		});
	return error;*/
	throw svelteError(404, 'Nicht eingerichtet');
}

export async function getAllEventsPaginated(formData: FilterEventsSchema, userId: number) {
	let query = supabaseServerClient()
		.from('4_Events')
		.select(
			`ID, Titel, Beschreibung, Beginn, Ende, Bewerbungsdeadline, 
			eventMaster:4_EventMaster(Titel),
			eventBewerbungen:4_EventBewerbungen(ID, MitgliedID, Besetzt, Anwesend)
			`
		)
		.eq('eventBewerbungen.MitgliedID', userId)
		.order('Beginn', { ascending: false })
		.range(formData.skip, formData.limit);

	if (formData.textSearch) query = query.ilike('Titel', `%${formData.textSearch}%`);
	switch (formData.dateFilter) {
		case 'upcoming':
			query = query.gte('Beginn', new Date().toISOString());
			break;
		case 'past':
			query = query.lt('Beginn', new Date().toISOString());
			break;
	}
	switch (formData.statusFilter) {
		case 'beworben':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Besetzt', false);
			query = query.eq('eventBewerbungen.Anwesend', false);
			break;
		case 'besetzt':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Besetzt', true);
			query = query.eq('eventBewerbungen.Anwesend', false);
			break;
		case 'anwesend':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Anwesend', true);
			break;
	}

	let { data, error } = await query;
	data = throwFetchErrorIfNeeded(data, error, 'Events konnten nicht geladen werden');
	return data;
}

export async function getEventDetailsById(eventId: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_Events')
		.select(
			`ID, Titel, Beschreibung, Beginn, Ende, Bewerbungsdeadline, Ort, StrasseHausnummer, Postleitzahl, BewerbungstextGewuenscht, BewTextVorgabe, AnlageGewuenscht, AnlageInhalte, AngabeEssgewGewuenscht,
             event_master:4_EventMaster(Titel),
             event_verantwortliche:4_EventVerantwortliche(mitglieder:1_Mitglieder(Vorname, Nachname))`
		)
		.eq('ID', eventId)
		.single();

	data = throwFetchErrorIfNeeded(data, error, 'Event konnte nicht geladen werden');
	return data;
}

export async function getEventApplicationState(eventId: number, userId: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.select('ID, Besetzt, Anwesend')
		.eq('EventID', eventId)
		.eq('MitgliedID', userId);

	data = throwFetchErrorIfNeeded(data, error, 'Bewerbungsstatus konnte nicht geladen werden');
	return data;
}
