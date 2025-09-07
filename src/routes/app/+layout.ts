import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ parent, depends }) => {
	// Invalidate when auth state changes so userId is refreshed
	depends('supabase:auth');
	// Get supabase and user from the root layout
	const { supabase, user } = await parent();

	let userId: number = -1;
	if (user) {
		const { data, error: dbError } = await supabase
			.from('1_Mitglieder')
			.select('ID')
			.eq('UserID', user.user_metadata?.custom_claims?.oid)
			.single();
		if (dbError || !data || !data.ID) {
			throw error(401, 'Benutzer nicht gefunden oder Zugriff nicht erlaubt');
		} else {
			userId = data.ID;
		}
	}

	return { userId };
};
