import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { data: user, error } = await locals.supabase.auth.getUser();

	if (!user || error) throw redirect(303, '/');

	const { data: userDetails, error: userDetailsError } = await locals.supabase
		.from('01_mitglieder_mitglieder')
		.select('*')
		.eq('id', user.user.id)
		.single();

	if (!userDetails || error) throw redirect(302, '/');

	return { data: { user: user.user, userDetails }, error: false };
};
