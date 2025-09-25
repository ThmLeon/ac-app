/*import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import SharepointList from './list';

export async function updateEventMaster(formData: EventMasterForm) {
	const EventMasterList = new SharepointList('4_EventMaster');
	await EventMasterList.update(formData.ID, formData);
	return;
}

export async function addEventMaster(formData: EventMasterForm) {
	const EventMasterList = new SharepointList('4_EventMaster');
	const ID = await EventMasterList.create(formData);
	return ID;
}

export async function deleteEventMaster(ID: number) {
	const EventMasterList = new SharepointList('4_EventMaster');
	await EventMasterList.delete(ID);
	return;
}*/
