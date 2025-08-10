import type { eventMasterSchema } from '@/schemas/eventMasterSchema';
import SharepointList from './list.server';
import type z from 'zod';
import type { newEventSchema } from '@/schemas/newEventSchema';

type EventMasterData = z.infer<typeof eventMasterSchema>;
type EventData = z.infer<typeof newEventSchema>;

export async function updateEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_EventMaster');
	return await EventMasterList.update(data.ID, data);
}

export async function addEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_EventMaster');
	const result = await EventMasterList.create(data);
	return result;
}

export async function deleteEventMaster(id: number) {
	const EventMasterList = new SharepointList('4_EventMaster');
	return await EventMasterList.delete(id);
}

export async function createNewEvent(data: EventData) {
	const EventList = new SharepointList('4_Events');
	const result = await EventList.create(data);
	return result;
}
