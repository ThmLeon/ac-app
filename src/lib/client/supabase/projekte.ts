import type { Database } from '@/database.types';
import type { eventsFilterType } from '@/state/EventList.svelte';
import { throwFetchErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getJobboardAnzeigen(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('3_JobboardAnzeigen')
		.select(`*`)
		.gte('AnzeigeAktivBis', new Date().toISOString());

	data = throwFetchErrorIfNeeded(data, error, 'Jobboard Anzeigen konnten nicht geladen werden');
	return data;
}
