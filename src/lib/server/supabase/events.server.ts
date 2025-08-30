import { getSignedStorageURL, throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';
import { fail, error as svelteError } from '@sveltejs/kit';
import type { FilterEventsSchema } from '@/schemas/filterEventsSchema';
import type { EventBewerbungForm } from '@/schemas/eventBewerbungSchema';
import type { EventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';

export async function getAllEventMasters() {
	let { data, error } = await supabaseServerClient()
		.from('4_EventMaster')
		.select('ID, Titel, MasterBeschreibung, Eventart')
		.order('Eventart', { ascending: true });
	data = throwFetchErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	return data;
}

export async function getEventMasterById(id: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_EventMaster')
		.select('Eventart')
		.eq('ID', id)
		.single();

	data = throwFetchErrorIfNeeded(data, error, 'Event Master konnte nicht geladen werden');
	return data;
}

export async function deleteEventMaster(id: number) {
	const { error } = await supabaseServerClient().from('4_EventMaster').delete().eq('ID', id);
	return error;
}

export async function deleteEventApplication(id: number) {
	const { error } = await supabaseServerClient().from('4_EventBewerbungen').delete().eq('ID', id);
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

export async function updateEventApplication(formData: EventBewerbungForm) {
	const { error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.update({
			BewerbungText: formData.BewerbungText,
			Essgewohnheiten: formData.Essgewohnheiten
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

export async function createNewEvent(
	formData: NewEventForm,
	sharepointResults: { EventResult: number; eventVerantwortlicheIDs: number[] }
) {
	const { image, IstHSMEvent, EventVerantwortliche, ...eventData } = formData; // Explicitly exclude EventVerantwortliche
	const { error: eventError } = await supabaseServerClient()
		.from('4_Events')
		.insert({
			...eventData,
			ID: sharepointResults.EventResult,
			Beginn: eventData.Beginn.toISOString(),
			Ende: eventData.Ende.toISOString(),
			Bewerbungsdeadline: eventData.Bewerbungsdeadline?.toISOString(),
			CheckInBeginn: eventData.CheckInBeginn?.toISOString(),
			Postleitzahl: eventData.Postleitzahl?.toString() || null,
			FCFSSlots: eventData.FCFSSlots || null
		});
	if (eventError) return eventError;
	sharepointResults.eventVerantwortlicheIDs.forEach(async (verantwortlicherEintragId, i) => {
		const { error: eventVerantwortlicherError } = await supabaseServerClient()
			.from('4_EventVerantwortliche')
			.insert({
				ID: verantwortlicherEintragId,
				Titel: EventVerantwortliche[i].Titel,
				EventID: sharepointResults.EventResult,
				MitgliedID: EventVerantwortliche[i].ID,
				Besetzt: true
			});
		if (eventVerantwortlicherError) return eventVerantwortlicherError;
	});

	//upload image
	if (image && image.size > 0) {
		const ext = image.name.split('.').pop();
		const path = `titelbilder/${sharepointResults.EventResult}/${sharepointResults.EventResult}.${ext}`;

		const { error: imageUploadError } = await supabaseServerClient()
			.storage.from('events')
			.upload(path, image);
		console.log(imageUploadError);
		if (imageUploadError) return imageUploadError;
	}

	return eventError;
}

export async function createEventApplication(
	formData: EventBewerbungForm,
	id: number,
	userTitel: string,
	eventId: number,
	userId: number
) {
	let besetzt: boolean = formData.Anmeldeart != 'Bewerben';

	const { error: bewerbungError } = await supabaseServerClient().from('4_EventBewerbungen').insert({
		ID: id,
		Titel: userTitel,
		EventID: eventId,
		MitgliedID: userId,
		BewerbungText: formData.BewerbungText,
		Besetzt: besetzt,
		Anwesend: false,
		Essgewohnheiten: formData.Essgewohnheiten
	});
	if (bewerbungError || !formData.Anlage) return bewerbungError;

	const { error: anlageError } = await supabaseServerClient()
		.storage.from('events')
		.upload(
			`bewerbungenAnhang/${eventId}/${id}.${formData.Anlage.name.split('.').pop()}`,
			formData.Anlage
		);
	return anlageError;
}

type allEventsPaginated = {
	ID: number;
	Titel: string | null;
	Beschreibung: string | null;
	Beginn: string | null;
	Ende: string | null;
	Bewerbungsdeadline: string | null;
	ImageUrl: string | null;
	eventMaster: {
		Titel: string | null;
	} | null;
	eventBewerbungen: {
		ID: number;
		MitgliedID: number | null;
		Besetzt: boolean | null;
		Anwesend: boolean | null;
	}[];
}[];

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
			`ID, Titel, Beschreibung, Beginn, Ende, Anmeldeart, Bewerbungsdeadline, Ort, StrasseHausnummer, Postleitzahl, BewerbungstextGewuenscht, BewTextVorgabe, AnlageGewuenscht, AnlageInhalte, AngabeEssgewGewuenscht, FCFSSlots,
             event_master:4_EventMaster(Titel),
             event_verantwortliche:4_EventVerantwortliche(mitglieder:1_Mitglieder(ID, Vorname, Nachname, Art, Rolle))`
		)
		.eq('ID', eventId)
		.single();

	data = throwFetchErrorIfNeeded(data, error, 'Event konnte nicht geladen werden');
	return data;
}

export async function getEventApplicationState(eventId: number, userId: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.select('ID, Besetzt, Anwesend, BewerbungText, Essgewohnheiten')
		.eq('EventID', eventId)
		.eq('MitgliedID', userId);

	data = throwFetchErrorIfNeeded(data, error, 'Bewerbungsstatus konnte nicht geladen werden');
	return data;
}

export async function getEventApplications(eventId: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.select(`ID, MitgliedID, EventID, Besetzt, Anwesend, Titel`)
		.eq('EventID', eventId)
		.order('Titel', { ascending: false });

	data = throwFetchErrorIfNeeded(data, error, 'Bewerbungen konnten nicht geladen werden');
	return data;
}

export async function getNumberOfEventApplications(eventId: number) {
	let { data, error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.select('*', { count: 'exact' })
		.eq('EventID', eventId);

	data = throwFetchErrorIfNeeded(data, error, 'Anzahl der Bewerbungen konnte nicht geladen werden');
	return data.length;
}

export async function getEventTitleImage(eventId: number) {
	return await getSignedStorageURL(
		supabaseServerClient(),
		'events',
		`titelbilder/${eventId}`,
		eventId
	);
}

export async function setEventBesetzungAnwesenheit(eventData: EventBesetzungAnwesenheitSchema) {
	let { error } = await supabaseServerClient()
		.from('4_EventBewerbungen')
		.update({
			Besetzt: eventData.Besetzt,
			Anwesend: eventData.Anwesend
		})
		.eq('ID', eventData.ID);

	return error;
}
