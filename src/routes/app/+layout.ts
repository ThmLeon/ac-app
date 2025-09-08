import type { Database } from '@/database.types';
import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

type RoleListKey = {
	RolleID: number;
	Rolle: string;
};
type RoleListValue = Database['public']['Tables']['1_RollenMitglieder']['Row'];
type RoleMap = Map<RoleListKey, RoleListValue>;

export const load: LayoutLoad = async ({ parent, depends }) => {
	// Invalidate when auth state changes so userId is refreshed
	depends('supabase:auth');
	// Get supabase and user from the root layout
	const { supabase, user } = await parent();

	let userId: number = -1;
	let roles: RoleMap = new Map();

	if (user) {
		const { data: userIdData, error: userIdError } = await supabase
			.from('1_Mitglieder')
			.select('ID')
			.eq('UserID', user.user_metadata?.custom_claims?.oid)
			.single();
		if (userIdError || !userIdData || !userIdData.ID) {
			throw error(401, 'Benutzer nicht gefunden oder Zugriff nicht erlaubt');
		} else {
			userId = userIdData.ID;
		}

		const { data: rolesData, error: rolesError } = await supabase
			.from('1_RollenMitglieder')
			.select('*, rollen:1_Rollen(Titel)')
			.eq('MitgliedID', userId)
			.is('EndeDatum', null);
		if (rolesError) throw error(401, 'Rollen konnten nicht geladen werden');
		const makeKey = (r: (typeof rolesData)[number]): RoleListKey => ({
			RolleID: r.RollenID,
			Rolle: r.rollen.Titel ?? '' // or throw/skip if null isn't allowed
		});

		for (const r of rolesData ?? []) {
			if (!r.rollen.Titel) continue; // decide how you want to handle null titles
			const { RollenID, rollen, ...value } = r; // remove ID & Titel
			roles.set(makeKey(r), value as RoleListValue);
		}
	}

	return { userId, roles };
};
