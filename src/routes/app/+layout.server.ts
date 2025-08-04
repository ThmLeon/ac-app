import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { data: user, error } = await locals.supabase.auth.getUser();

	if (!user || error) throw redirect(303, '/');

	const { data: userDetails, error: userDetailsError } = await locals.supabase
		.from('1_Mitglieder')
		.select('*')
		.eq('UserID', user.user.user_metadata.custom_claims.oid)
		.single();

	if (!userDetails || userDetailsError) {
		console.log(user.user);
		console.log(userDetails);
		console.log(userDetailsError);
		throw redirect(302, '/');
	}

	return { data: { user: user.user, userDetails }, error: false };
};
