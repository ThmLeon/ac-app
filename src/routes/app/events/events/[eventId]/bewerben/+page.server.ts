/*import { throwMissingErrorIfNeeded } from '@/utils/utils.server';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect, error as svelteError } from '@sveltejs/kit';
import { getEventApplicationState, getEventDetailsById } from '@/server/supabase/events.server';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = throwMissingErrorIfNeeded(params.eventId);
	const userId = throwMissingErrorIfNeeded(locals.user?.id);

	const eventData = await getEventDetailsById(eventId);
	const applicationState = await getEventApplicationState(eventId, userId);

	if (applicationState.length != 0) {
		// already applied, not allowed to apply again
		redirect(303, `../${eventId}`);
	}

	return {
		eventData: eventData,
		alreadyApplied: applicationState
	};
};

export const actions: Actions = {
	sendApplication: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const eventId = formData.get('event_id');
		const bewerbungstext = formData.get('bewerbungstext');
		const anhang = formData.get('anhang') as File;
		const userId = (await locals.safeGetSession()).user?.id;

		let fileName = '';

		if (!eventId || !userId) return fail(400, { error: true, message: 'Fehlerhafte Daten' });

		const { data: existingApplications, error: existingApplicationsError } = await supabase
			.from('04_events_bewerbungen')
			.select('id')
			.eq('event_id', eventId.toString())
			.eq('mitglied_id', userId.toString());

		if (existingApplicationsError) {
			return fail(500, { error: true, message: 'Fehler beim Abrufen der Bewerbungen' });
		}
		if (existingApplications.length != 0) {
			return fail(500, {
				error: true,
				message: 'Du hast dich bereits für dieses Event beworben'
			});
		}

		if (anhang) {
			fileName = `${eventId}/${userId}/${anhang.name}`;
			const { data: fileData, error: fileError } = await supabase.storage
				.from('event.anhaenge')
				.upload(fileName, anhang, {
					cacheControl: '3600',
					upsert: true
				});
			if (fileError) {
				return fail(500, { error: true, message: 'Fehler beim Hochladen der Datei' });
			}
		}

		const { error } = await supabase.from('04_events_bewerbungen').insert({
			event_id: eventId.toString(),
			bewerbungstext: bewerbungstext?.toString(),
			bewerbungs_datei_name: fileName,
			mitglied_id: userId.toString(),
			besetzt: false,
			anwesend: false
		});

		if (error) {
			return fail(500, { error: true, message: 'Fehler beim Senden der Bewerbung' });
		}
		return { success: true, message: 'Bewerbung erfolgreich gesendet' };
	}
};*/
