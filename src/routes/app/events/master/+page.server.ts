import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { data, error } = await supabase
		.from('04_events_master')
		.select('id, master_name, beschreibung');

	return { events_master: data ?? [] };
};

export const actions: Actions = {
	deleteEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const eventId = formData.get('id');

		console.log('Deleting event with ID:', eventId);

		if (typeof eventId !== 'string') {
			return { success: false, error: 'Invalid event ID' };
		}

		const { error } = await supabase.from('04_events_master').delete().eq('id', eventId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	},

	updateEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const eventId = formData.get('id');
		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');
		if (
			typeof eventId !== 'string' ||
			typeof masterName !== 'string' ||
			typeof beschreibung !== 'string'
		) {
			return { success: false, error: 'Invalid input data' };
		}

		const { error } = await supabase
			.from('04_events_master')
			.update({ master_name: masterName, beschreibung: beschreibung })
			.eq('id', eventId);

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	},

	addEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');

		if (typeof masterName !== 'string' || typeof beschreibung !== 'string') {
			return { success: false, error: 'Invalid input data' };
		}

		const { error } = await supabase
			.from('04_events_master')
			.insert({ master_name: masterName, beschreibung: beschreibung });

		if (error) {
			return { success: false, error: error.message };
		}

		return { success: true };
	}
};
