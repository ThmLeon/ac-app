import type { Database } from '@/database.types';
import type { PostgrestError } from '@supabase/supabase-js';
import { fail, error as svelteError } from '@sveltejs/kit';

export function formatEuro(amount: number, locale = 'de-DE'): string {
	return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);
}

export function throwFetchErrorIfNeeded<T>(
	data: T,
	error: PostgrestError | null,
	errorMessage: string = 'Ein unbekannter Fehler ist aufgetreten',
	emptyArrayIsError: boolean = false
): NonNullable<T> {
	if (error || !data || (Array.isArray(data) && data.length === 0 && emptyArrayIsError)) {
		throw svelteError(404, errorMessage);
	}
	return data;
}

type Art = Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
type Rolle = Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
export function mitgliederStatusAsText(art: Art, rolle: Rolle): string {
	switch (rolle) {
		case 'Mitglied':
			return art === 'Aktiv' ? 'Aktives Mitglied' : 'Passives Mitglied';
		case 'Alumni':
			return art === 'Aktiv' ? 'Aktiver Alumni' : 'Passiver Alumni';
		case 'Anwärter':
			return art === 'Aktiv' ? 'Aktiver Trainee' : 'Passiver Trainee';
		default:
			return 'Unbekannter Status';
	}
}
