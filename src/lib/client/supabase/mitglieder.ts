import type { Database } from '@/database.types';
import { throwFetchErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getRollen(supabase: SupabaseClient<Database>) {
	let { data, error } = await supabase
		.from('1_Rollen')
		.select(
			`ID, Titel, VBBezug, VorgesetzteRolle, Beschreibung, KernTeam, Mitglieder:1_RollenMitglieder(ID, Titel, RollenID, MitgliedID, LeitendeFunktion)`
		)
		.eq('AzureSync', true)
		.eq('RolleAktiv', true)
		.eq('OrgChartZeigen', true)
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
