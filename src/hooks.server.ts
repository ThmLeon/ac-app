import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import SupabaseServerClient from '@/server/supabase/supabaseServerClient.server';
import { fail, error as svelteError } from '@sveltejs/kit';

const supabase: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
		return new Response(null, { status: 204 }); // Return empty response with 204 No Content
	}

	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = SupabaseServerClient.setInstance(event);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (!event.locals.session && event.url.pathname.startsWith('/private')) {
		redirect(303, '/auth');
	}

	if (event.locals.session && event.url.pathname === '/auth') {
		redirect(303, '/private');
	}

	const userDetailsCookie = event.cookies.get('userDetails');
	const oid = event.locals.user?.user_metadata?.custom_claims.oid;
	if (!userDetailsCookie && oid) {
		const { error: userDetailsError, data: userDetails } = await event.locals.supabase
			.from('1_Mitglieder')
			.select('ID, Vorname, Nachname, Titel')
			.eq('UserID', oid)
			.single();

		if (userDetailsError) {
			svelteError(500, 'Error fetching user details');
		} else {
			event.cookies.set('userDetails', JSON.stringify(userDetails), {
				httpOnly: true,
				path: '/',
				maxAge: 60 * 60 // 1 hour
			});
		}
	}
	event.locals.userDetails = JSON.parse(event.cookies.get('userDetails') || '{}');

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
