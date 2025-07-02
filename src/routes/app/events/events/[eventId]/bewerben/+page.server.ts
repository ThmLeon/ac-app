import type { Actions, PageServerLoad } from './$types';
import { fail, error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const eventId = params.eventId;
	const { supabase } = locals;

	const eventData = await supabase
		.from('04_events_events')
		.select(
			`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt, anhang_benoetigt, anhang_beschreibung, bewerbungstext_benoetigt, bewerbungstext_beschreibung,
             event_master:04_events_master(master_name),
             event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
		)
		.eq('id', eventId)
		.single()
		.then(({ data, error }) => {
			if (error || !data) throw svelteError(500, { message: 'Event not found' });
			return data;
		});

	return {
		eventData: eventData
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
};
