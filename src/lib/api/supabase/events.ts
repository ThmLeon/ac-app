import type { Database } from '@/api/supabase/database.types';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';
import type { EventsFilterType } from '@/types/events';
import {
	throwFetchErrorIfNeeded,
	throwSupabaseActionErrorIfNeeded,
	throwSupabaseErrorIfNeeded
} from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { EventBewerbungForm } from '@/schemas/eventBewerbungSchema';
import type { EventBesetzungAnwesenheitForm } from '@/schemas/eventBesetzungAnwesenheitSchema';

export async function listEventsPaginatedFiltered(
	supabase: SupabaseClient<Database>,
	mitgliedID: number,
	filter: EventsFilterType,
	skip: number,
	limit: number
) {
	let query = supabase
		.from('4_Events')
		.select(
			`ID, Titel, Beschreibung, Beginn, Ende, Bewerbungsdeadline, 
                eventMaster:4_EventMaster!inner(Titel, Eventart),
                eventBewerbungen:4_EventBewerbungen(ID, MitgliedID, Besetzt, Anwesend)
                `
		)
		.eq('eventBewerbungen.MitgliedID', mitgliedID)
		.neq('eventMaster.Eventart', 'HSM')
		.order('Beginn', { ascending: false })
		.range(skip, limit);

	if (filter.textSearch) query = query.ilike('Titel', `%${filter.textSearch}%`);
	switch (filter.dateFilter) {
		case 'upcoming':
			query = query.gte('Beginn', new Date().toISOString());
			break;
		case 'past':
			query = query.lt('Beginn', new Date().toISOString());
			break;
	}
	switch (filter.statusFilter) {
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
	if (error) console.log(error);
	data = throwSupabaseErrorIfNeeded(data, error, 'Events konnten nicht geladen werden');

	return data;
}

export async function getEventDetailsById(
	supabase: SupabaseClient<Database>,
	eventId: number,
	mitgliedId: number
) {
	const eventQuery = supabase
		.from('4_Events')
		.select(
			`*,
       eventMaster:4_EventMaster(*),
       eventVerantwortliche:4_EventVerantwortliche(*, mitglieder:1_Mitglieder(*)),
       userBewerbung:4_EventBewerbungen(*)`
		)
		.eq('ID', eventId)
		.eq('userBewerbung.MitgliedID', mitgliedId)
		.single();

	const totalAppsQuery = supabase.rpc('get_event_application_count', { event_id: eventId });

	/*const { data:imageUrlData, error:imageUrlError } = await supabase.functions.invoke(
            'get-signed-storage-url',
            {
                method: 'POST',
                body: JSON.stringify({bucketName: 'events', folderPath:'`titelbilder/${eventId}`', id:eventId}),
            }
        );
        const {url} = imageUrlData;*/

	// Run all in parallel
	const [eventRes, totalAppsRes] = await Promise.all([eventQuery, totalAppsQuery]);

	const data = throwSupabaseErrorIfNeeded(
		eventRes.data,
		eventRes.error,
		'Event konnte nicht geladen werden'
	);

	const totalApplications = throwSupabaseErrorIfNeeded(
		totalAppsRes.data,
		totalAppsRes.error,
		'Anzahl der Bewerbungen konnte nicht geladen werden'
	);

	return { eventDetails: data, imageURL: null, totalApplications };
}

export async function getAllEventMasters(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('4_EventMaster')
		.select('ID, Titel, MasterBeschreibung, Eventart');
	data = throwSupabaseErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	data?.sort((a, b) => (b.Eventart ?? '').localeCompare(a.Eventart ?? ''));

	return data;
}

export async function updateEventMaster(
	supabase: SupabaseClient<Database>,
	formData: EventMasterForm
) {
	const { error } = await supabase
		.from('4_EventMaster')
		.update({
			Titel: formData.Titel,
			MasterBeschreibung: formData.MasterBeschreibung,
			Eventart: formData.Eventart
		})
		.eq('ID', formData.ID);
	throwSupabaseActionErrorIfNeeded(error, 'Event Master konnte nicht aktualisiert werden');
	return;
}

export async function deleteEventMaster(supabase: SupabaseClient<Database>, ID: number) {
	const { error } = await supabase.from('4_EventMaster').delete().eq('ID', ID);
	throwSupabaseActionErrorIfNeeded(error, 'Event Master konnte nicht gelöscht werden');
	return;
}

export async function deleteEvent(supabase: SupabaseClient<Database>, ID: number) {
	const { error } = await supabase.from('4_Events').delete().eq('ID', ID);
	throwSupabaseActionErrorIfNeeded(error, 'Event konnte nicht gelöscht werden');
	return;
}

export async function addEventMaster(
	supabase: SupabaseClient<Database>,
	formData: EventMasterForm,
	id: number
) {
	const { error } = await supabase.from('4_EventMaster').insert({
		ID: id,
		Titel: formData.Titel,
		MasterBeschreibung: formData.MasterBeschreibung,
		Eventart: formData.Eventart
	});
	throwSupabaseActionErrorIfNeeded(error, 'Event Master konnte nicht erstellt werden');
	return;
}

export async function getEventMasterByID(supabase: SupabaseClient<Database>, id: number) {
	const { data, error } = await supabase.from('4_EventMaster').select('*').eq('ID', id).single();
	let returnData = throwSupabaseErrorIfNeeded(
		data,
		error,
		'Event Master konnte nicht geladen werden'
	);
	return returnData;
}

export async function createNewEvent(
	supabase: SupabaseClient<Database>,
	eventID: number,
	eventVerantwortlicheIDs: number[],
	formData: NewEventForm
) {
	const { image, IstHSMEvent, EventVerantwortliche, ...eventData } = formData; // Explicitly exclude EventVerantwortliche
	const { error: eventError } = await supabase.from('4_Events').insert({
		...eventData,
		ID: eventID,
		Beginn: eventData.Beginn.toISOString(),
		Ende: eventData.Ende.toISOString(),
		Bewerbungsdeadline: eventData.Bewerbungsdeadline?.toISOString(),
		CheckInBeginn: eventData.CheckInBeginn?.toISOString(),
		Postleitzahl: eventData.Postleitzahl?.toString() || null,
		FCFSSlots: eventData.FCFSSlots || null
	});
	throwSupabaseActionErrorIfNeeded(eventError, 'Event konnte nicht erstellt werden');
	eventVerantwortlicheIDs.forEach(async (verantwortlicherEintragId, i) => {
		const { error: eventVerantwortlicherError } = await supabase
			.from('4_EventVerantwortliche')
			.insert({
				ID: verantwortlicherEintragId,
				Titel: EventVerantwortliche[i].Titel,
				EventID: eventID,
				MitgliedID: EventVerantwortliche[i].ID,
				Besetzt: true
			});
		throwSupabaseActionErrorIfNeeded(
			eventVerantwortlicherError,
			'Event Verantwortlicher konnte nicht erstellt werden'
		);
	});

	//upload image
	if (image && image.size > 0) {
		const ext = image.name.split('.').pop();
		const path = `titelbilder/${eventID}/${eventID}.${ext}`;

		const { error: imageUploadError } = await supabase.storage.from('events').upload(path, image);
		console.log(imageUploadError);
		if (imageUploadError) return imageUploadError;
	}

	return eventError;
}

export async function updateEvent(
	supabase: SupabaseClient<Database>,
	formData: NewEventForm,
	eventVerantwortlicheIDs: number[],
	eventId: number
) {
	const { image, IstHSMEvent, EventVerantwortliche, ...eventData } = formData;

	const { error: eventError } = await supabase
		.from('4_Events')
		.update({
			...eventData,
			Beginn: eventData.Beginn.toISOString(),
			Ende: eventData.Ende.toISOString(),
			Bewerbungsdeadline: eventData.Bewerbungsdeadline?.toISOString(),
			CheckInBeginn: eventData.CheckInBeginn?.toISOString(),
			Postleitzahl: eventData.Postleitzahl?.toString() || null,
			FCFSSlots: eventData.FCFSSlots || null
		})
		.eq('ID', eventId);
	if (eventError) return eventError;

	// Reset Verantwortliche
	const { error: deleteError } = await supabase
		.from('4_EventVerantwortliche')
		.delete()
		.eq('EventID', eventId);
	if (deleteError) return deleteError;

	for (const [i, verantwortlicherEintragId] of eventVerantwortlicheIDs.entries()) {
		const { error: eventVerantwortlicherError } = await supabase
			.from('4_EventVerantwortliche')
			.insert({
				ID: verantwortlicherEintragId,
				Titel: EventVerantwortliche[i].Titel,
				EventID: eventId,
				MitgliedID: EventVerantwortliche[i].ID,
				Besetzt: true
			});
		if (eventVerantwortlicherError) return eventVerantwortlicherError;
	}

	if (image && image.size > 0) {
		const ext = image.name.split('.').pop();
		const path = `titelbilder/${eventId}/${eventId}.${ext}`;
		const { error: imageUploadError } = await supabase.storage
			.from('events')
			.upload(path, image, { upsert: true });
		if (imageUploadError) return imageUploadError;
	}

	return eventError;
}

export async function createEventApplication(
	supabase: SupabaseClient<Database>,
	formData: EventBewerbungForm,
	applicationID: number,
	userTitel: string,
	eventID: number,
	userID: number
) {
	let besetzt: boolean = formData.Anmeldeart != 'Bewerben';

	const { error: bewerbungError } = await supabase.from('4_EventBewerbungen').insert({
		ID: applicationID,
		Titel: userTitel,
		EventID: eventID,
		MitgliedID: userID,
		BewerbungText: formData.BewerbungText,
		Besetzt: besetzt,
		Anwesend: false,
		Essgewohnheiten: formData.Essgewohnheiten
	});
	throwSupabaseActionErrorIfNeeded(bewerbungError, 'Bewerbung konnte nicht gesendet werden');

	if (formData.Anlage) {
		const { error: anlageError } = await supabase.storage
			.from('events')
			.upload(
				`bewerbungenAnhang/${eventID}/${applicationID}.${formData.Anlage.name.split('.').pop()}`,
				formData.Anlage
			);
		throwSupabaseActionErrorIfNeeded(anlageError, 'Anlage konnte nicht gesendet werden');
	}

	return;
}

export async function updateEventApplication(
	supabase: SupabaseClient<Database>,
	formData: EventBewerbungForm
) {
	const { error } = await supabase
		.from('4_EventBewerbungen')
		.update({
			BewerbungText: formData.BewerbungText,
			Essgewohnheiten: formData.Essgewohnheiten
		})
		.eq('ID', formData.ID);
	throwSupabaseActionErrorIfNeeded(error, 'Bewerbung konnte nicht aktualisiert werden');
	return;
}

export async function deleteEventApplication(
	supabase: SupabaseClient<Database>,
	applicationID: number
) {
	const { error } = await supabase.from('4_EventBewerbungen').delete().eq('ID', applicationID);
	throwSupabaseActionErrorIfNeeded(error, 'Bewerbung konnte nicht gelöscht werden');
}

export async function getEventApplications(supabase: SupabaseClient<Database>, eventId: number) {
	let { data, error } = await supabase
		.from('4_EventBewerbungen')
		.select(`ID, MitgliedID, EventID, Besetzt, Anwesend, Titel, BewerbungText, Essgewohnheiten`)
		.eq('EventID', eventId)
		.order('Titel', { ascending: false });

	data = throwFetchErrorIfNeeded(data, error, 'Bewerbungen konnten nicht geladen werden');
	return data;
}

export async function setEventBesetzungAnwesenheit(
	supabase: SupabaseClient<Database>,
	formData: EventBesetzungAnwesenheitForm
) {
	let { error } = await supabase
		.from('4_EventBewerbungen')
		.update({
			Besetzt: formData.Besetzt,
			Anwesend: formData.Anwesend
		})
		.eq('ID', formData.ID);

	throwSupabaseActionErrorIfNeeded(error, 'Besetzung/Anwesenheit konnte nicht gesetzt werden');
	return;
}
