import type { PageServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { data, error } = await supabase
		.from('04_events_events')
		.select(
			'id, event_master_id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, event_master:04_events_master(master_name)'
		);
	if (error || data.length === 0)
		svelteError(500, { message: 'Events konnten nicht geladen werden' });
	return { eventsData: data };
};
