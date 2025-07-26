import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import { type EventMasterForm } from '@/schemas/eventMaster';
import { PostgrestError } from '@supabase/supabase-js';

export async function getAllEventMasters() {
	let { data, error } = await supabaseServerClient()
		.from('04_events_master')
		.select('id, master_name, beschreibung')
		.order('master_name', { ascending: true });

	data = throwFetchErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	return data;
}

export async function deleteEventMaster(id: string) {
	const { error } = await supabaseServerClient().from('04_events_master').delete().eq('id', id);
	return error;
}

export async function updateEventMaster(formData: EventMasterForm) {
	const { error } = await supabaseServerClient()
		.from('04_events_master')
		.update({
			master_name: formData.master_name,
			beschreibung: formData.beschreibung
		})
		.eq('id', formData.id);
	return error;
}

export async function addEventMaster(formData: EventMasterForm) {
	const { error } = await supabaseServerClient().from('04_events_master').insert({
		master_name: formData.master_name,
		beschreibung: formData.beschreibung
	});
	return error;
}
