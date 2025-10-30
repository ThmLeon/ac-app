import type { Database } from '@/api/supabase/database.types';
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import { createRolesContext, setRolesContext } from '@/context/rolesContext';
import { writable } from 'svelte/store';

export const ssr = false;

export const load: LayoutLoad = async ({ parent, depends }) => {
	// Invalidate when auth state changes so userId is refreshed
	depends('supabase:auth');
	// Get supabase and user from the root layout
	const { supabase, user } = await parent();

	let userId: number = -1;
	let isAdmin: boolean = false;
	let rolesData: Database['public']['Tables']['1_RollenMitglieder']['Row'][] = [];
	let userDetails: Database['public']['Tables']['1_Mitglieder']['Row'];

	if (user) {
		const { data: userData, error: userError } = await supabase
			.from('1_Mitglieder')
			.select('*')
			.eq('UserID', user.user_metadata?.custom_claims?.oid)
			.single();
		if (userError || !userData || !userData.ID) {
			throw error(401, 'Benutzer nicht gefunden oder Zugriff nicht erlaubt');
		} else {
			userDetails = userData;
			userId = userData.ID;
		}

		const { data: rolesFetchingData, error: rolesError } = await supabase
			.from('1_RollenMitglieder')
			.select('*, rollen:1_Rollen(Titel)')
			.eq('MitgliedID', userId)
			.is('EndeDatum', null);
		if (rolesError) throw error(401, 'Rollen konnten nicht geladen werden');
		rolesData = rolesFetchingData;

		const { data: isAdminData, error: isAdminError } = await supabase
			.from('0_Metadata')
			.select('ID')
			.eq('Titel', 'AppAdmin')
			.eq('Key', 'MitgliedID')
			.eq('Value', userId.toString());
		if (isAdminError) isAdmin = false;
		else isAdmin = isAdminData.length === 1;
	} else {
		throw error(401, 'Benutzer nicht gefunden oder Zugriff nicht erlaubt');
	}
	return { userId, rolesData, isAdmin, userDetails };
};
