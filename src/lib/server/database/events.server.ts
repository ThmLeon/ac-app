import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';

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

export async function createNewEvent(formData: NewEventForm) {
	const { error } = await supabaseServerClient()
		.from('04_events_events')
		.insert({
			...formData,
			start_datum_zeit: formData.start_datum_zeit.toISOString(),
			ende_datum_zeit: formData.ende_datum_zeit.toISOString(),
			bewerbungs_deadline: formData.bewerbungs_deadline.toISOString()
		});
	return error;
}
