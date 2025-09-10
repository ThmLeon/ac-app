import type { Actions, LayoutServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { feedbackSchema } from '@/schemas/feedbackSchema';
import { returnActionResult } from '@/utils/utils.server';
import { addFeedback } from '@/server/supabase/feedback.server';

export const load: LayoutServerLoad = async ({ locals }) => {
	const fullName = locals.user?.user_metadata.full_name;

	if (!fullName) return svelteError(401, 'Unauthorized');

	const feedbackForm = await superValidate(zod(feedbackSchema));

	return {
		data: { vorname: fullName.split(' ')[0], nachname: fullName.split(' ')[1] },
		feedbackForm
	};
};

export const actions: Actions = {
	sendFeedback: async ({ request }) => {
		const form = await superValidate(request, zod(feedbackSchema));
		return returnActionResult(
			form,
			() => addFeedback(form.data),
			'Fehler beim Senden des Feedbacks',
			'Feedback erfolgreich gesendet'
		);
	}
};
