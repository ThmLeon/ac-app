import { getAllEventsPaginated } from '@/server/supabase/events.server';
import { zod } from 'sveltekit-superforms/adapters';
import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import { superValidate } from 'sveltekit-superforms/server';
import { filterEventsSchema } from '@/schemas/filterEventsSchema.js';

export const POST = async ({ url, locals, request }) => {
	const form = await superValidate(request, zod(filterEventsSchema));
	const userId = throwMissingErrorIfNeeded(locals.userDetails?.ID);

	const data = await getAllEventsPaginated(form.data, userId);

	return Response.json({ success: true, events: data });
};
