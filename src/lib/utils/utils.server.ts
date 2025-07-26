import type { PostgrestError } from '@supabase/supabase-js';
import { fail, error as svelteError } from '@sveltejs/kit';

import { message } from 'sveltekit-superforms/server';
import type { SuperValidated } from 'sveltekit-superforms/server';

/**
 * Checks the result of a Supabase API call and throws a SvelteKit HTTP error when:
 * - `error` is not null
 * - `data` is falsy
 * - `data` is an empty array and `emptyArrayIsError` is true
 *
 * @template T             The expected type of the API response.
 * @param data            The data returned by the API call. If falsy, an error is thrown.
 * @param error           A PostgrestError from Supabase. If present, an error is thrown.
 * @param errorMessage    Custom error message for the thrown HTTP error. Defaults to 'Ein unbekannter Fehler ist aufgetreten'.
 * @param emptyArrayIsError When true and `data` is an array, an empty array is treated as an error. Defaults to false.
 * @returns               The non-null/undefined API result of type T.
 * @throws                A 404 SvelteKit HTTP error with the provided message if:
 *                         - `error` is not null
 *                         - `data` is falsy
 *                         - `data` is an empty array and `emptyArrayIsError` is true
 */
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

export async function returnActionResult(
	form: SuperValidated<any>,
	action: () => Promise<PostgrestError | null>,
	errorMessage: string = 'Ein Fehler ist aufgetreten',
	successMessage: string = 'Die Aktion war erfolgreich'
) {
	if (!form.valid) {
		return fail(400, { form });
	}

	const error = await action();

	if (error) {
		return message(form, errorMessage, { status: 500 });
	}
	return message(form, successMessage);
}
