import type { Database } from '@/api/supabase/database.types';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';
import { callSharepointAPI } from '@/utils/utils';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { getEventDetailsById, getEventMasterByID } from '../supabase/events';
import type { EventBesetzungAnwesenheitForm } from '@/schemas/eventBesetzungAnwesenheitSchema';
import type { EventBewerbungForm } from '@/schemas/eventBewerbungSchema';

export async function updateEventMaster(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: EventMasterForm
) {
	const { ...data } = formData;
	await callSharepointAPI(supabase, session, {
		action: 'update',
		itemId: formData.ID,
		formData: data,
		tableName: '4_EventMaster'
	});
	return;
}

export async function addEventMaster(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: EventMasterForm
) {
	const { ID, ...data } = formData;
	const return_ID = await callSharepointAPI(supabase, session, {
		action: 'insert',
		formData: data,
		tableName: '4_EventMaster'
	});
	return return_ID;
}

export async function deleteEventMaster(
	supabase: SupabaseClient<Database>,
	session: Session,
	ID: number
) {
	await callSharepointAPI(supabase, session, {
		action: 'delete',
		itemId: ID,
		tableName: '4_EventMaster'
	});
	return;
}

export async function createNewEvent(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: NewEventForm
) {
	//transformData
	let transformedData = { ...formData } as any;
	transformedData['AnlageGew_x00fc_nscht'] = transformedData.AnlageGewuenscht;
	delete transformedData.AnlageGewuenscht;
	transformedData['BewerbungstextGew_x00fc_nscht'] = transformedData.BewerbungstextGewuenscht;
	delete transformedData.BewerbungstextGewuenscht;
	transformedData['AngabeEssgewGew_x00fc_nscht'] = transformedData.AngabeEssgewGewuenscht;
	delete transformedData.AngabeEssgewGewuenscht;
	delete transformedData.EventVerantwortliche; // Remove this field, as it will be handled separately
	delete transformedData.IstHSMEvent;
	delete transformedData.image;

	let { Eventart } = await getEventMasterByID(supabase, transformedData.MasterEventID);
	transformedData.Eventart = Eventart;

	let newEventID = await callSharepointAPI(supabase, session, {
		action: 'insert',
		formData: transformedData,
		tableName: '4_Events'
	});

	const eventVerantwortlicheIDs: number[] = [];
	for (const verantwortlicher of formData.EventVerantwortliche) {
		const eventVerantwortlicheID = await callSharepointAPI(supabase, session, {
			action: 'insert',
			formData: {
				Title: verantwortlicher.Titel,
				EventID: newEventID,
				MitgliedID: verantwortlicher.ID,
				Besetzt: true
			},
			tableName: '4_EventVerantwortliche'
		});
		eventVerantwortlicheIDs.push(eventVerantwortlicheID!);
	}

	return { newEventID, eventVerantwortlicheIDs };
}

export async function updateEvent(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: NewEventForm,
	eventID: number
) {
	let transformedData = { ...formData } as any;
	transformedData['AnlageGew_x00fc_nscht'] = transformedData.AnlageGewuenscht;
	delete transformedData.AnlageGewuenscht;
	transformedData['BewerbungstextGew_x00fc_nscht'] = transformedData.BewerbungstextGewuenscht;
	delete transformedData.BewerbungstextGewuenscht;
	transformedData['AngabeEssgewGew_x00fc_nscht'] = transformedData.AngabeEssgewGewuenscht;
	delete transformedData.AngabeEssgewGewuenscht;
	delete transformedData.EventVerantwortliche; // Remove this field, as it will be handled separately
	delete transformedData.IstHSMEvent;
	delete transformedData.image;

	let { Eventart } = await getEventMasterByID(supabase, transformedData.MasterEventID);
	transformedData.Eventart = Eventart;

	await callSharepointAPI(supabase, session, {
		action: 'update',
		itemId: eventID,
		formData: transformedData,
		tableName: '4_Events'
	});

	const { eventDetails } = await getEventDetailsById(supabase, eventID, 0);
	for (const ev of eventDetails.eventVerantwortliche) {
		await callSharepointAPI(supabase, session, {
			action: 'delete',
			itemId: ev.ID,
			tableName: '4_EventVerantwortliche'
		});
	}

	const eventVerantwortlicheIDs: number[] = [];
	for (const ev of formData.EventVerantwortliche) {
		const eventVerantwortlicheID = await callSharepointAPI(supabase, session, {
			action: 'insert',
			formData: {
				Title: ev.Titel,
				EventID: eventID,
				MitgliedID: ev.ID,
				Besetzt: true
			},
			tableName: '4_EventVerantwortliche'
		});
		eventVerantwortlicheIDs.push(eventVerantwortlicheID!);
	}
	return eventVerantwortlicheIDs;
}

export async function createEventApplication(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: EventBewerbungForm,
	eventId: number,
	userTitel: string,
	userId: number
) {
	let besetzt: boolean = formData.Anmeldeart != 'Bewerben';

	const newApplicationID = await callSharepointAPI(supabase, session, {
		action: 'insert',
		formData: {
			Title: userTitel,
			EventID: eventId,
			MitgliedID: userId,
			BewerbungText: formData.BewerbungText,
			Besetzt: besetzt,
			Anwesend: false,
			Essgewohnheiten: formData.Essgewohnheiten
		},
		tableName: '4_EventBewerbungen'
	});
	return newApplicationID!;
}

export async function updateEventApplication(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: EventBewerbungForm
) {
	await callSharepointAPI(supabase, session, {
		action: 'update',
		formData: {
			BewerbungText: formData.BewerbungText,
			Essgewohnheiten: formData.Essgewohnheiten
		},
		tableName: '4_EventBewerbungen',
		itemId: formData.ID
	});
}

export async function deleteEventApplication(
	supabase: SupabaseClient<Database>,
	session: Session,
	applicationId: number
) {
	await callSharepointAPI(supabase, session, {
		action: 'delete',
		itemId: applicationId,
		tableName: '4_EventBewerbungen'
	});
}

export async function deleteEvent(
	supabase: SupabaseClient<Database>,
	session: Session,
	eventId: number
) {
	await callSharepointAPI(supabase, session, {
		action: 'delete',
		itemId: eventId,
		tableName: '4_Events'
	});
}

export async function setEventBesetzungAnwesenheit(
	supabase: SupabaseClient<Database>,
	session: Session,
	formData: EventBesetzungAnwesenheitForm
) {
	await callSharepointAPI(supabase, session, {
		action: 'update',
		itemId: formData.ID,
		formData: {
			Besetzt: formData.Besetzt,
			Anwesend: formData.Anwesend
		},
		tableName: '4_EventBewerbungen'
	});
}
