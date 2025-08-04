import SharepointList from './list.server';
import type { Database } from '../supabase/database.types';

export async function updateEventMaster(data: any) {
	const EventMasterList = new SharepointList('4_eventMaster');
	return await EventMasterList.update(data.id.toString(), data);
}
