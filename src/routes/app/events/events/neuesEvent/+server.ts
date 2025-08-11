import { getAllEventsPaginated } from '@/server/supabase/events.server';
import { zod } from 'sveltekit-superforms/adapters';
import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import { superValidate } from 'sveltekit-superforms/server';
import { searchMitgliederSchema } from '@/schemas/searchMitgliederSchema';
import { searchMitglieder } from '@/server/supabase/mitglieder.server.js';

export const POST = async ({ url, locals, request }) => {
	const form = await superValidate(request, zod(searchMitgliederSchema));
	const data = await searchMitglieder(form.data.nameSearch);
	return Response.json({ success: true, mitglieder: data });
};
