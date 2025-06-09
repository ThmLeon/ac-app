import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {};

export const actions: Actions = {
	createEvent: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		return null;
	}
};
