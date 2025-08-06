import type { eventMasterSchema } from '@/schemas/eventMasterSchema';
import SharepointList from './list.server';
import type z from 'zod';

type EventMasterData = z.infer<typeof eventMasterSchema>;

export async function updateEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_eventMaster');
	return await EventMasterList.update(data.ID, data);
}

export async function addEventMaster(data: EventMasterData) {
	const EventMasterList = new SharepointList('4_eventMaster');
	const result = await EventMasterList.create(data);
	return result;
}

export async function deleteEventMaster(id: number) {
	const EventMasterList = new SharepointList('4_eventMaster');
	return await EventMasterList.delete(id);
}
