import SharepointList from './list.server';

export async function updateEventMaster(data: any) {
	const EventMasterList = new SharepointList('4_eventMaster');
	return await EventMasterList.update(data.id, data);
}

export async function addEventMaster(data: any) {
	const EventMasterList = new SharepointList('4_eventMaster');
	const result = await EventMasterList.create(data);
	return result;
}

export async function deleteEventMaster(id: number) {
	const EventMasterList = new SharepointList('4_eventMaster');
	return await EventMasterList.delete(id);
}
