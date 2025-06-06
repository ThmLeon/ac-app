import { redirect } from '@sveltejs/kit';

export const POST = async (event: any) => {
	const {
		url,
		locals: { supabase }
	} = event;

	await supabase.auth.signOut();
	throw redirect(303, '/');
};
