import type { Database } from '@/database.types';
import type { MitgliederFilterType } from '@/types/mitglieder';
import { throwSupabaseErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function listMitgliederPaginatedFiltered(
	supabase: SupabaseClient<Database>,
	filter: MitgliederFilterType,
	skip: number,
	limit: number
) {
	let query = supabase
		.from('1_Mitglieder')
		.select(`ID, Titel, Art, Rolle, Beraterstufe, Generation`)
		.order('Titel', { ascending: true })
		.range(skip, limit);

	if (filter.textSearch) query = query.ilike('Titel', `%${filter.textSearch}%`);

	if (filter.mitgliedsart.length > 0) query = query.in('Art', filter.mitgliedsart);

	if (filter.mitgliedsrolle.length > 0) query = query.in('Rolle', filter.mitgliedsrolle);

	if (filter.beraterstufe.length > 0) query = query.in('Beraterstufe', filter.beraterstufe);

	if (filter.generation !== null) query = query.eq('Generation', filter.generation);

	let { data, error } = await query;

	data = throwSupabaseErrorIfNeeded(data, error, 'Mitglieder konnten nicht geladen werden');

	return data;
}
