import { getJobboardAnzeigen } from '@/client/supabase/projekte';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, parent }) => {
	const { supabase } = await parent();
	const jobboardAnzeigen = getJobboardAnzeigen(supabase);

	return {
		jobboardAnzeigen: jobboardAnzeigen
	};
};
