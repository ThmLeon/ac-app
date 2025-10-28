import type { Database } from '@/api/supabase/database.types';
import { type PostgrestError, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { type ActionResult, error as svelteError } from '@sveltejs/kit';
import type { QueryClient, QueryKey } from '@sveltestack/svelte-query';
import { toast } from 'svelte-sonner';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { de } from 'date-fns/locale';

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
			return 'Unbekannter Status';
		case 'Alumni':
			if (art === 'Aktiv') return 'Aktiver Alumni';
			if (art === 'Passiv') return 'Passiver Alumni';
			if (art === 'Ehemalig') return 'Ehemaliger Alumni';
			return 'Unbekannter Status';
		case 'Anwärter':
			if (art === 'Aktiv') return 'Aktiver Trainee';
			if (art === 'Passiv') return 'Passiver Trainee';
			if (art === 'Ehemalig') return 'Ehemaliger Trainee';
			return 'Unbekannter Status';
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
export function throwSupabaseErrorIfNeeded<T>(
	data: T,
	error: PostgrestError | null,
	errorMessage: string = 'Ein unbekannter Fehler ist aufgetreten',
	emptyArrayIsError: boolean = false
): NonNullable<T> {
	if (
		error ||
		data === null ||
		data === undefined ||
		(Array.isArray(data) && data.length === 0 && emptyArrayIsError)
	) {
		throw new Error(errorMessage);
	}
	return data;
}

export function throwSupabaseActionErrorIfNeeded(
	error: PostgrestError | Error | null,
	errorMessage: string = 'Ein unbekannter Fehler ist aufgetreten'
): void {
	if (error) {
		console.log(error);
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

type SharepointAction =
	| { action: 'insert'; formData: any; tableName: string }
	| { action: 'update'; itemId: number; formData: any; tableName: string }
	| { action: 'delete'; itemId: number; tableName: string };

export async function callSharepointAPI(
	supabase: SupabaseClient<Database>,
	session: Session,
	action: SharepointAction
) {
	if (action.action === 'insert') {
		const { data, error } = await supabase.functions.invoke(
			'sharepoint-list-api/' + action.tableName,
			{
				method: 'POST',
				body: action.formData,
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			}
		);
		if (error || !data?.success || !data || !data.id) throw new Error('Sharepoint Fehler');
		else return data.id as number;
	} else if (action.action === 'update') {
		const { data, error } = await supabase.functions.invoke(
			'sharepoint-list-api/' + action.tableName + '/' + action.itemId,
			{
				method: 'PATCH',
				body: action.formData,
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			}
		);
		if (error || !data?.success) throw new Error('Sharepoint Fehler');
		else return;
	} else if (action.action === 'delete') {
		const { data, error } = await supabase.functions.invoke(
			'sharepoint-list-api/' + action.tableName + '/' + action.itemId,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			}
		);
		if (error || !data?.success) throw new Error('Sharepoint Fehler');
		else return;
	}
}
export function formatDate(date: string | null): string {
	if (!date) return '-';
	const parsedDate = new Date(date);
	return format(parsedDate, 'dd.MM.yyyy HH:mm', { locale: de });
}

export function formatApplicationDeadline(deadline: string | null): string {
	if (!deadline) return 'Keine Frist angegeben';
	const now = new Date();
	const deadlineDate = new Date(deadline);

	const minutesDiff = differenceInMinutes(deadlineDate, now);
	const hoursDiff = differenceInHours(deadlineDate, now);
	const daysDiff = differenceInDays(deadlineDate, now);

	if (minutesDiff <= 0) {
		return 'Abgelaufen'; // Deadline has passed
	} else if (minutesDiff < 60) {
		return `in ${minutesDiff} Minuten`;
	} else if (hoursDiff < 24) {
		const remainingMinutes = minutesDiff % 60;
		return `in ${hoursDiff} Stunden und ${remainingMinutes} Minuten`;
	} else if (daysDiff <= 7) {
		const remainingHours = hoursDiff % 24;
		return `in ${daysDiff} Tagen und ${remainingHours} Stunden`;
	} else {
		return format(deadlineDate, 'dd.MM.yyyy HH:mm', { locale: de }); // Format date in German standard
	}
}

export function getInitials(name: string): string {
	const names = name.split(' ');
	if (names.length === 0) return '';
	const firstName = names[0].charAt(0).toUpperCase();
	const lastName = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
	return `${firstName}${lastName}`;
}

export function formatTextWithHTML(text: string): string {
	return text
		.replace(/\n/g, '<br>') // Zeilenumbrüche in <br>
		.replace(/\t•\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;• ') // Tabs mit Bulletpoints ersetzen
		.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}

export function handleActionResultSonners(result: ActionResult, toastId: string) {
	toast.dismiss(toastId);
	if (result.type === 'success') {
		const message = (result.data?.form.message as string) || 'Eingabe erfolgreich';
		toast.success(message, {
			id: `${toastId}_success`
		});
	} else if (result.type === 'failure') {
		console.log(result);
		const message = (result.data?.form.message as string) || 'Ein Fehler ist aufgetreten';
		toast.error(message, {
			id: `${toastId}_failure`
		});
	} else {
		toast.error('Ein unerwarteter Fehler ist aufgetreten', {
			id: `${toastId}_failure`
		});
	}
}
