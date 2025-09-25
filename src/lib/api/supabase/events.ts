import type { Database } from '@/database.types';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { EventsFilterType } from '@/types/events';
import { throwSupabaseActionErrorIfNeeded, throwSupabaseErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';
import { map } from 'superstruct';

export async function listEventsPaginatedFiltered(
	supabase: SupabaseClient<Database>,
	mitgliedID: number,
	filter: EventsFilterType,
	skip: number,
	limit: number
) {
	let query = supabase
		.from('4_Events')
		.select(
			`ID, Titel, Beschreibung, Beginn, Ende, Bewerbungsdeadline, 
                eventMaster:4_EventMaster(Titel),
                eventBewerbungen:4_EventBewerbungen(ID, MitgliedID, Besetzt, Anwesend)
                `
		)
		.eq('eventBewerbungen.MitgliedID', mitgliedID)
		.order('Beginn', { ascending: false })
		.range(skip, limit);

	if (filter.textSearch) query = query.ilike('Titel', `%${filter.textSearch}%`);
	switch (filter.dateFilter) {
		case 'upcoming':
			query = query.gte('Beginn', new Date().toISOString());
			break;
		case 'past':
			query = query.lt('Beginn', new Date().toISOString());
			break;
	}
	switch (filter.statusFilter) {
		case 'beworben':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Besetzt', false);
			query = query.eq('eventBewerbungen.Anwesend', false);
			break;
		case 'besetzt':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Besetzt', true);
			query = query.eq('eventBewerbungen.Anwesend', false);
			break;
		case 'anwesend':
			query = query.not('eventBewerbungen', 'is', null);
			query = query.eq('eventBewerbungen.Anwesend', true);
			break;
	}

	let { data, error } = await query;
	data = throwSupabaseErrorIfNeeded(data, error, 'Events konnten nicht geladen werden');

	return data;
}

export async function getAllEventMasters(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('4_EventMaster')
		.select('ID, Titel, MasterBeschreibung, Eventart');
	data = throwSupabaseErrorIfNeeded(data, error, 'Events Master konnten nicht geladen werden');
	data?.sort((a, b) => (b.Eventart ?? '').localeCompare(a.Eventart ?? ''));

	return data;
}

export async function updateEventMaster(
	supabase: SupabaseClient<Database>,
	formData: EventMasterForm
) {
	const { error } = await supabase
		.from('4_EventMaster')
		.update({
			Titel: formData.Titel,
			MasterBeschreibung: formData.MasterBeschreibung,
			Eventart: formData.Eventart
		})
		.eq('ID', formData.ID);
	throwSupabaseActionErrorIfNeeded(error, 'Event Master konnte nicht aktualisiert werden');
	return;
}

export async function deleteEventMaster(supabase: SupabaseClient<Database>, ID: number) {
	const { error } = await supabase.from('4_EventMaster').delete().eq('ID', ID);
	throwSupabaseActionErrorIfNeeded(error, 'Event Master konnte nicht gelöscht werden');
	return;
}
