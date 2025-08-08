import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const fullName = locals.user?.user_metadata.full_name;

	if (!fullName) return svelteError(401, 'Unauthorized');

	return { data: { vorname: fullName.split(' ')[0], nachname: fullName.split(' ')[1] } };
};
