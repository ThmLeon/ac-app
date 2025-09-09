import type { eventMasterSchema } from '@/schemas/eventMasterSchema';
import SharepointList from './list.server';
import type z from 'zod';
import type { newEventSchema } from '@/schemas/newEventSchema';
import { getEventMasterById } from '../supabase/events.server';
import type { eventBewerbungSchema } from '@/schemas/eventBewerbungSchema';
import type { EventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';

type EventMasterData = z.infer<typeof eventMasterSchema>;
type EventData = z.infer<typeof newEventSchema>;
type BewerbungData = z.infer<typeof eventBewerbungSchema>;

export async function updateEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_EventMaster');
	return await EventMasterList.update(data.ID, data);
}

export async function updateEventApplication(data: BewerbungData) {
	const BewerbungList = new SharepointList('4_EventBewerbungen');
	return await BewerbungList.update(data.ID, {
		BewerbungText: data.BewerbungText,
		Essgewohnheiten: data.Essgewohnheiten
	});
}

export async function addEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_EventMaster');

	// Copy data and rename fields to use proper German umlauts
	const transformedData = { ...data } as any;
	if ('AnlageGewuenscht' in transformedData) {
		transformedData.AnlageGewünscht = transformedData.AnlageGewuenscht;
		delete transformedData.AnlageGewuenscht;
	}
	if ('BewerbungstextGewuenscht' in transformedData) {
		transformedData.BewerbungstextGewünscht = transformedData.BewerbungstextGewuenscht;
		delete transformedData.BewerbungstextGewuenscht;
	}

	const result = await EventMasterList.create(transformedData);
	return result;
}

export async function deleteEventMaster(id: number) {
	const EventMasterList = new SharepointList('4_EventMaster');
	return await EventMasterList.delete(id);
}

export async function deleteEvent(id: number) {
	const EventList = new SharepointList('4_Events');
	return await EventList.delete(id);
}

export async function createNewEvent(data: EventData) {
	const EventList = new SharepointList('4_Events');
	//transformData
	let transformedData = { ...data } as any;
	transformedData['AnlageGew_x00fc_nscht'] = transformedData.AnlageGewuenscht;
	delete transformedData.AnlageGewuenscht;
	transformedData['BewerbungstextGew_x00fc_nscht'] = transformedData.BewerbungstextGewuenscht;
	delete transformedData.BewerbungstextGewuenscht;
	transformedData['AngabeEssgewGew_x00fc_nscht'] = transformedData.AngabeEssgewGewuenscht;
	delete transformedData.AngabeEssgewGewuenscht;
	delete transformedData.EventVerantwortliche; // Remove this field, as it will be handled separately
	delete transformedData.IstHSMEvent;
	delete transformedData.image;

	let { Eventart } = await getEventMasterById(transformedData.MasterEventID);
	transformedData.Eventart = Eventart;

	const EventResult = await EventList.create(transformedData);
	if (EventResult instanceof Error) return EventResult;

	const eventVerantwortlicheIDs: number[] = [];
	const EventVerantwortlicheList = new SharepointList('4_EventVerantwortliche');
	for (const verantwortlicher of data.EventVerantwortliche) {
		const VerantwortlicherResult = await EventVerantwortlicheList.create({
			Title: verantwortlicher.Titel,
			EventID: EventResult,
			MitgliedID: verantwortlicher.ID,
			Besetzt: true
		});
		if (VerantwortlicherResult instanceof Error) return VerantwortlicherResult;
		eventVerantwortlicheIDs.push(VerantwortlicherResult);
	}

	return { EventResult, eventVerantwortlicheIDs };
}

export async function createEventApplication(
	data: BewerbungData,
	userTitel: string,
	eventId: number,
	userId: number
) {
	const BewerbungList = new SharepointList('4_EventBewerbungen');

	let besetzt: boolean = data.Anmeldeart != 'Bewerben';

	const BewerbungResult = await BewerbungList.create({
		Title: userTitel,
		EventID: eventId,
		MitgliedID: userId,
		BewerbungText: data.BewerbungText,
		Besetzt: besetzt,
		Anwesend: false,
		Essgewohnheiten: data.Essgewohnheiten
		//Anlage: data.Anlage
	});

	return BewerbungResult;
}

export async function deleteEventApplication(id: number) {
	const BewerbungList = new SharepointList('4_EventBewerbungen');
	return await BewerbungList.delete(id);
}

export async function setEventBesetzungAnwesenheit(eventData: EventBesetzungAnwesenheitSchema) {
	const EventBesetzungAnwesenheitList = new SharepointList('4_EventBewerbungen');
	return await EventBesetzungAnwesenheitList.update(eventData.ID, {
		Besetzt: eventData.Besetzt,
		Anwesend: eventData.Anwesend
	});
}
