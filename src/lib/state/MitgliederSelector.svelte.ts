import type { Database } from '@/api/supabase/database.types';
import { throwFetchErrorIfNeeded } from '@/utils/utils';
import type { SupabaseClient } from '@supabase/supabase-js';

type Mitglied = {
	ID: number;
	Titel: string | null;
	Art: Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'] | null;
	Rolle: Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'] | null;
};

class MitgliederSelector {
	mitglieder: Mitglied[] = $state([]);
	selected: Mitglied[] = $state([]);
	isLoading: boolean = $state(false);
	query: string = $state('');
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>) {
		this.supabase = supabase;
	}

	addMitglied(mitglied: Mitglied) {
		if (!this.selected.find((m) => m.ID === mitglied.ID)) {
			this.selected = [...this.selected, mitglied];
			this.query = '';
		}
	}
	removeMitglied(mitgliedId: number) {
		this.selected = this.selected.filter((m) => m.ID !== mitgliedId);
	}
	async searchMitglied() {
		const q = this.query.trim();
		if (q.length === 0) {
			this.isLoading = false;
			this.mitglieder = [];
			return;
		}
		this.isLoading = true;
		try {
			const parts = q.split(/\s+/).filter((s) => s.length > 0);
			const ilikePattern = `%${parts.join('%')}%`;

			let { data, error } = await this.supabase
				.from('1_Mitglieder')
				.select('ID, Titel, Art, Rolle')
				.order('Titel', { ascending: true })
				.ilike('Titel', ilikePattern)
				.limit(8);

			data = throwFetchErrorIfNeeded(data, error, 'Mitglieder konnten nicht geladen werden');
			this.mitglieder = data;
		} catch {
			this.mitglieder = [];
		} finally {
			this.isLoading = false;
		}
	}
}

export function getMitgliederSelector(supabase: SupabaseClient<Database>) {
	return new MitgliederSelector(supabase);
}
