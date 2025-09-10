import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { newEventSchema, type NewEventForm } from '@/schemas/newEventSchema';
import {
	getAllEventMasters,
	getEventDetailsById,
	updateEvent as updateEventSupabase
} from '@/server/supabase/events.server';
import { updateEvent as updateEventSharepoint } from '@/server/sharepoint/events.server';
import { returnCreateActionResultBoth, throwMissingErrorIfNeeded } from '@/utils/utils.server';
type EventDetails = Awaited<ReturnType<typeof getEventDetailsById>>;

function toFormData(eventData: EventDetails): NewEventForm {
	const defaults: Partial<NewEventForm> = {
		Titel: '',
		Beschreibung: '',
		Semester: '',
		KostenEUR: 0,
		AnlageGewuenscht: false,
		BewerbungstextGewuenscht: false,
		AngabeEssgewGewuenscht: false,
		IstHSMEvent: false
	};

	const base: Record<string, unknown> = Object.fromEntries(
		Object.entries({ ...defaults, ...eventData }).map(([key, value]) => [
			key,
			value ?? (defaults as Record<string, unknown>)[key] ?? undefined
		])
	);

	return {
		...(base as Record<string, unknown>),
		Beginn: base.Beginn ? new Date(base.Beginn as string | number | Date) : new Date(),
		Ende: base.Ende ? new Date(base.Ende as string | number | Date) : new Date(),
		Bewerbungsdeadline: base.Bewerbungsdeadline
			? new Date(base.Bewerbungsdeadline as string | number | Date)
			: undefined,
		CheckInBeginn: base.CheckInBeginn
			? new Date(base.CheckInBeginn as string | number | Date)
			: undefined,
		EventVerantwortliche: eventData.event_verantwortliche.map((v) => ({
			ID: v.MitgliedID,
			Titel: v.Titel
		})),
		image: undefined
	} as NewEventForm;
}

export const load: PageServerLoad = async ({ params }) => {
	const eventId = Number(throwMissingErrorIfNeeded(params.eventId));
	const eventData = await getEventDetailsById(eventId);
	const eventMasters = await getAllEventMasters();

	const formData = toFormData(eventData);
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
