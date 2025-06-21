import type { Actions, PageServerLoad } from './$types';
import { error as svelteError } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;
	const { data, error } = await supabase
		.from('04_events_master')
		.select('id, master_name, beschreibung');

	if (error || data.length === 0)
		svelteError(500, { message: 'Events konnten nicht geladen werden' });

	if (error) return { data: null, error: true };
	return { data: data ?? [], error: false };
};

export const actions: Actions = {
	deleteEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const eventId = formData.get('id');

		if (eventId == null) return { error: true };

		const { error } = await supabase.from('04_events_master').delete().eq('id', eventId.toString());

		if (error) return { error: true };
		return { error: false };
	},

	updateEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		const eventId = formData.get('id');
		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');
		if (eventId == null || masterName == null || beschreibung == null) {
			return { error: true };
		}

		const { error } = await supabase
			.from('04_events_master')
			.update({ master_name: masterName.toString(), beschreibung: beschreibung.toString() })
			.eq('id', eventId.toString());

		if (error) return { error: true };
		return { error: false };
	},

	addEventMaster: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		const masterName = formData.get('master_name');
		const beschreibung = formData.get('beschreibung');

		if (masterName == null || beschreibung == null) return { error: true };

		const { error } = await supabase
			.from('04_events_master')
			.insert({ master_name: masterName.toString(), beschreibung: beschreibung.toString() });

		if (error) return { error: true };
		return { error: false };
	}
};
