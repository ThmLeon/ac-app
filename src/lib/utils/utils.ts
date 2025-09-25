import type { Database } from '@/database.types';
import type { PostgrestError } from '@supabase/supabase-js';
import { error as svelteError } from '@sveltejs/kit';
import type { QueryClient, QueryKey } from '@sveltestack/svelte-query';

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
		svelteError(404, errorMessage);
	}
	return data;
}

type Art = Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
type Rolle = Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
export function mitgliederStatusAsText(art: Art, rolle: Rolle): string {
	switch (rolle) {
		case 'Mitglied':
			if (art === 'Aktiv') return 'Aktives Mitglied';
			if (art === 'Passiv') return 'Passives Mitglied';
			if (art === 'Ehemalig') return 'Ehemaliges Mitglied';
		case 'Alumni':
			if (art === 'Aktiv') return 'Aktiver Alumni';
			if (art === 'Passiv') return 'Passiver Alumni';
			if (art === 'Ehemalig') return 'Ehemaliger Alumni';
		case 'Anwärter':
			if (art === 'Aktiv') return 'Aktiver Trainee';
			if (art === 'Passiv') return 'Passiver Trainee';
			if (art === 'Ehemalig') return 'Ehemaliger Trainee';
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

export const rollenIDToVB = (ID: number | null, kurz: boolean) => {
	if (ID === null) return 'N/A';
	switch (ID) {
		case 9:
			return kurz ? 'F&R' : 'Finanzen & Recht';
		case 12:
			return kurz ? 'Internes' : 'Internes';
		case 11:
			return kurz ? 'KB' : 'Kundenbetreuung';
		case 13:
			return kurz ? 'MPR' : 'Marketing & PR';
		case 10:
			return kurz ? 'TPM' : 'Technologie & Prozessmanagement';
		case 16:
			return 'Sonstige';
		default:
			return 'N/A';
	}
};

export function throwSupabaseErrorIfNeeded<T>(
	data: T,
	error: PostgrestError | null,
	errorMessage: string = 'Ein unbekannter Fehler ist aufgetreten',
	emptyArrayIsError: boolean = false
): NonNullable<T> {
	if (error || !data || (Array.isArray(data) && data.length === 0 && emptyArrayIsError)) {
		throw new Error(errorMessage);
	}
	return data;
}

export function throwSupabaseActionErrorIfNeeded(
	error: PostgrestError | null,
	errorMessage: string = 'Ein unbekannter Fehler ist aufgetreten'
): void {
	if (error) {
		throw new Error(errorMessage);
	}
}

export function svelteQuerySnapshotToDataArray<T>(snapshot: [QueryKey, T[]][]) {
	return snapshot.flatMap(([, data]) => data ?? []);
}

export async function optimisticUpdateArray<T extends { ID: number }>(
	queryClient: QueryClient,
	queryKey: QueryKey,
	updatedItem: T,
	sortFunction?: (a: T, b: T) => number
) {
	await queryClient.cancelQueries({ queryKey: queryKey });
	let snapshot = svelteQuerySnapshotToDataArray(
		queryClient.getQueriesData<T[]>({
			queryKey: queryKey
		})
	);
	snapshot = snapshot.filter((item) => item.ID !== updatedItem.ID);
	const optimistic: T[] = [...snapshot, updatedItem];
	if (sortFunction) optimistic.sort(sortFunction);
	queryClient.setQueryData(queryKey, optimistic);
}

export async function optimisticDeleteArray<T extends { ID: number }>(
	queryClient: QueryClient,
	queryKey: QueryKey,
	deletedID: number,
	sortFunction?: (a: T, b: T) => number
) {
	await queryClient.cancelQueries({ queryKey: queryKey });
	const snapshot = queryClient.getQueriesData<T[]>({
		queryKey: queryKey
	});
	const optimistic: T[] = svelteQuerySnapshotToDataArray(snapshot).filter(
		(item) => item.ID !== deletedID
	);
	if (sortFunction) optimistic.sort(sortFunction);
	queryClient.setQueryData(queryKey, optimistic);
}
