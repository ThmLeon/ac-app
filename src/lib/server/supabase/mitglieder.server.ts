import { throwFetchErrorIfNeeded } from '@/utils/utils.server';
import { supabaseServerClient } from './supabaseServerClient.server';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import type { NewEventForm } from '@/schemas/newEventSchema';
import { fail, error as svelteError } from '@sveltejs/kit';
import type { FilterEventsSchema } from '@/schemas/filterEventsSchema';

export async function searchMitglieder(nameSearch: string) {
	// split on spaces, drop empties, then join with '%' for universal wildcard
	const parts = nameSearch.split(/\s+/).filter((s) => s.length > 0);
	const ilikePattern = `%${parts.join('%')}%`;

	let { data, error } = await supabaseServerClient()
		.from('1_Mitglieder')
		.select('ID, Titel, Art, Rolle')
		.order('Titel', { ascending: true })
		.ilike('Titel', ilikePattern)
		.limit(8);

	data = throwFetchErrorIfNeeded(data, error, 'Mitglieder konnten nicht geladen werden');
	return data;
}
