import type { Database } from '@/database.types';
import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
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
	action: () => Promise<Error | null>,
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

export async function returnUpdateActionResultBoth(
	form: SuperValidated<any>,
	actionSharepoint: () => Promise<Error | null>,
	actionSupabase: () => Promise<Error | null>,
	errorMessage: string = 'Ein Fehler ist aufgetreten',
	successMessage: string = 'Die Aktion war erfolgreich'
) {
	if (!form.valid) {
		return fail(400, { form });
	}
	const SharepointError = await actionSharepoint();
	if (SharepointError) {
		return message(form, errorMessage, { status: 500 });
	}

	const supabaseError = await actionSupabase();
	if (supabaseError) {
		return message(form, errorMessage, { status: 500 });
	}
	return message(form, successMessage);
}
export async function returnDeleteActionResultBoth(
	form: SuperValidated<any>,
	actionSharepoint: () => Promise<Error | null>,
	actionSupabase: () => Promise<Error | null>,
	errorMessage: string = 'Ein Fehler ist aufgetreten',
	successMessage: string = 'Die Aktion war erfolgreich'
) {
	if (!form.valid) {
		return fail(400, { form });
	}
	const SharepointError = await actionSharepoint();
	if (SharepointError) {
		return message(form, errorMessage, { status: 500 });
	}

	const supabaseError = await actionSupabase();
	if (supabaseError) {
		return message(form, errorMessage, { status: 500 });
	}
	return message(form, successMessage);
}

export async function returnCreateActionResultBoth<T>(
	form: SuperValidated<any>,
	actionSharepoint: () => Promise<Error | T>,
	actionSupabase: (values: T) => Promise<Error | null>,
	errorMessage: string = 'Ein Fehler ist aufgetreten',
	successMessage: string = 'Die Aktion war erfolgreich'
) {
	if (!form.valid) {
		return fail(400, { form });
	}
	const SharepointErrorOrData = await actionSharepoint();
	if (SharepointErrorOrData instanceof Error) {
		console.log('Sharepoint Error:', SharepointErrorOrData);
		return message(form, errorMessage, { status: 500 });
	}

	const supabaseError = await actionSupabase(SharepointErrorOrData as T);
	if (supabaseError) {
		console.log('Supabase Error:', supabaseError);
		return message(form, errorMessage, { status: 500 });
	}
	return message(form, successMessage);
}

export async function getSignedStorageURL(
	supabase: SupabaseClient<Database>,
	bucketName: string,
	folderPath: string,
	id: string | number
) {
	// List files in the folder (non-recursive)
	const { data: files, error: listErr } = await supabase.storage.from(bucketName).list(folderPath);

	if (listErr || !files || files.length === 0) return null;

	// Find a file named "<id>.<ext>"
	const file = files.find((f) => f.name.startsWith(`${id}.`));
	if (!file) return null;

	const path = `${folderPath}/${file.name}`;

	// Signed URL for 1 hour
	const { data: signed, error: signErr } = await supabase.storage
		.from(bucketName)
		.createSignedUrl(path, 60 * 60);

	if (signErr) return null;
	return signed?.signedUrl ?? null;
}

export function throwMissingErrorIfNeeded<T>(argument: T | undefined): T {
	if (!argument) {
		throw svelteError(400, { message: 'Fehler in den Daten' });
	} else {
		return argument;
	}
}
