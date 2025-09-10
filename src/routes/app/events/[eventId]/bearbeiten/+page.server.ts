import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newEventSchema } from '@/schemas/newEventSchema';
import {
	getAllEventMasters,
	getEventDetailsById,
	updateEvent as updateEventSupabase
} from '@/server/supabase/events.server';
import { updateEvent as updateEventSharepoint } from '@/server/sharepoint/events.server';
import { returnCreateActionResultBoth, throwMissingErrorIfNeeded } from '@/utils/utils.server';

export const load: PageServerLoad = async ({ params }) => {
	const eventId = Number(throwMissingErrorIfNeeded(params.eventId));
	const eventData = await getEventDetailsById(eventId);
	const eventMasters = await getAllEventMasters();

	const formData = {
		Titel: eventData.Titel ?? '',
		Beschreibung: eventData.Beschreibung ?? '',
		MasterEventID: eventData.MasterEventID!,
		Beginn: eventData.Beginn ? new Date(eventData.Beginn) : new Date(),
		Ende: eventData.Ende ? new Date(eventData.Ende) : new Date(),
		Anmeldeart: eventData.Anmeldeart,
		FCFSSlots: eventData.FCFSSlots ?? undefined,
		Bewerbungsdeadline: eventData.Bewerbungsdeadline
			? new Date(eventData.Bewerbungsdeadline)
			: undefined,
		CheckInBeginn: eventData.CheckInBeginn ? new Date(eventData.CheckInBeginn) : undefined,
		Semester: eventData.Semester ?? '',
		Postleitzahl: eventData.Postleitzahl ?? undefined,
		Ort: eventData.Ort ?? undefined,
		StrasseHausnummer: eventData.StrasseHausnummer ?? undefined,
		KostenString: eventData.KostenString ?? undefined,
		KostenEUR: eventData.KostenEUR ?? 0,
		image: undefined,
		AnlageGewuenscht: eventData.AnlageGewuenscht ?? false,
		AnlageInhalte: eventData.AnlageInhalte ?? undefined,
		BewerbungstextGewuenscht: eventData.BewerbungstextGewuenscht ?? false,
		BewTextVorgabe: eventData.BewTextVorgabe ?? undefined,
		AngabeEssgewGewuenscht: eventData.AngabeEssgewGewuenscht ?? false,
		EventVerantwortliche: eventData.event_verantwortliche.map((v: any) => ({
			ID: v.MitgliedID,
			Titel: v.Titel
		})),
		IstHSMEvent: eventData.IstHSMEvent ?? false,
		HSMPoints: eventData.HSMPoints ?? undefined
	};

	const form = await superValidate(formData, zod(newEventSchema));
	return { form, eventMasters };
};

export const actions: Actions = {
	updateEvent: async ({ request, params }) => {
		const form = await superValidate(request, zod(newEventSchema));
		const eventId = Number(throwMissingErrorIfNeeded(params.eventId));
		return returnCreateActionResultBoth(
			form,
			() => updateEventSharepoint(eventId, form.data),
			(sharepointResults) => updateEventSupabase(form.data, eventId, sharepointResults),
			'Fehler beim Aktualisieren des Events',
			'Event erfolgreich aktualisiert'
		);
	}
};
