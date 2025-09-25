import type { Database } from '@/database.types';
import type { mitgliederFilterType } from '@/state/MitgliederSearchState.svelte';
import { throwFetchErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getRollen(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('1_Rollen')
		.select(
			`ID, Titel, VBBezug, VorgesetzteRolle, Beschreibung, KernTeam, RolleAktiv, OrgChartZeigen, AzureSync, RolleAktiv, OrgChartZeigen, Mitglieder:1_RollenMitglieder(ID, Titel, RollenID, MitgliedID, LeitendeFunktion)`
		)
		.is('Mitglieder.EndeDatum', null)
		.order('VorgesetzteRolle', { ascending: true })
		.order('LeitendeFunktion', { foreignTable: 'Mitglieder', ascending: false, nullsFirst: false });
	data = throwFetchErrorIfNeeded(data, error, 'Rollen konnten nicht geladen werden');
	return data;
}

export async function getRollenMitglieder(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('1_RollenMitglieder')
		.select(`ID, Titel, RollenID, MitgliedID, LeitendeFunktion`)
		.is('EndeDatum', null);

	data = throwFetchErrorIfNeeded(data, error, 'Mitglieder Rollen konnten nicht geladen werden');
	return data;
}

export async function getAllMitgliederPaginated(
	supabase: SupabaseClient<Database>,
	filter: mitgliederFilterType,
	skip: number,
	limit: number
) {
	console.log(filter.textSearch);
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
	data = throwFetchErrorIfNeeded(data, error, 'Mitglieder konnten nicht geladen werden');

	return data;
}
