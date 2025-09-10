import type { FeedbackForm } from '@/schemas/feedbackSchema';
import { supabaseServerClient } from './supabaseServerClient.server';

export async function addFeedback(formData: FeedbackForm) {
	const { error } = await supabaseServerClient().from('Feedback').insert({
		Titel: formData.Titel,
		Kategorie: formData.Kategorie,
		AppSeite: formData.AppSeite,
		Beschreibung: formData.Beschreibung
	});
	return error;
}
