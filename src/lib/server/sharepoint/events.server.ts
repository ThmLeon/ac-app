import type { eventMasterSchema } from '@/schemas/eventMasterSchema';
import SharepointList from './list.server';
import type z from 'zod';
import type { newEventSchema } from '@/schemas/newEventSchema';
import { getEventMasterById } from '../supabase/events.server';

type EventMasterData = z.infer<typeof eventMasterSchema>;
type EventData = z.infer<typeof newEventSchema>;

export async function updateEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_EventMaster');
	return await EventMasterList.update(data.ID, data);
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

	let { Eventart } = await getEventMasterById(transformedData.MasterEventID);
	transformedData.Eventart = Eventart;

	const result = await EventList.create(transformedData);
	return result;
}
