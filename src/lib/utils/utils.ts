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

type Anmeldeart = Database['public']['Enums']['EventAnmeldeart'];
export function eventBewerbungMoeglich(
	deadline: Date | null,
	eventStart: Date,
	anmeldeart: Anmeldeart,
	alreadyApplied: boolean,
	FCFSSlotsFull: boolean
): { possible: boolean; modification: boolean; message: string } {
	// If the event has already started
	if (eventStart < new Date()) {
		return { possible: false, modification: false, message: 'Event bereits gestartet' };
	}

	// If there is a deadline and it has passed
	if (deadline && deadline < new Date()) {
		return {
			possible: false,
			modification: false,
			message: 'Bewerbungsdeadline bereits abgelaufen'
		};
	}
	// If the user has already applied
	if (alreadyApplied) {
		return { possible: false, modification: true, message: 'Bewerbung anpassen' };
	}

	// Handle specific cases based on the registration type
	switch (anmeldeart) {
		case 'Bewerben':
			return { possible: true, modification: false, message: 'Jetzt bewerben' };

		case 'Einschreiben':
			return { possible: true, modification: false, message: 'Jetzt anmelden' };

		case 'FCFS':
			if (FCFSSlotsFull) {
				return {
					possible: false,
					modification: false,
					message: 'Keine freien Plätze mehr verfügbar'
				};
			}
			return { possible: true, modification: false, message: 'Jetzt Platz sichern' };

		default:
			return { possible: false, modification: false, message: 'Unbekannte Anmeldeart' };
	}
}

export const badgeColors = {
	blue: 'bg-blue-200 text-blue-800',
	yellow: 'bg-yellow-200 text-yellow-800',
	green: 'bg-green-200 text-green-800',
	orange: 'bg-orange-200 text-orange-800',
	red: 'bg-red-200 text-red-800'
};
