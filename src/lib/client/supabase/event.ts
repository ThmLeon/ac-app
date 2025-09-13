import type { Database } from '@/database.types';
import type { eventsFilterType } from '@/state/EventList.svelte';
import { throwFetchErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getAllEventsPaginated(
	supabase: SupabaseClient<Database>,
	userId: number,
	filter: eventsFilterType,
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
		.eq('eventBewerbungen.MitgliedID', userId)
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
	data = throwFetchErrorIfNeeded(data, error, 'Events konnten nicht geladen werden');

	return data;
}
