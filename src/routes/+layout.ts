import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { redirect } from '@sveltejs/kit';
// @ts-ignore - Provided by SvelteKit at build/runtime; ignore IDE type resolution here
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { sharepointClient } from '@/client/sharepoint/sharepointClient';
import type { LayoutLoad } from './$types';
import type { Database } from '@/database.types';

export const load: LayoutLoad = async ({ data, depends, fetch, url }) => {
	/**
	 * Declare a dependency so the layout can be invalidated, for example, on
	 * session refresh.
	 */
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch },
				auth: { flowType: 'pkce' }
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: { fetch },
				cookies: {
					getAll() {
						return data.cookies;
					}
				},
				auth: { flowType: 'pkce' }
			});

	/**
	 * It's fine to use `getSession` here, because on the client, `getSession` is
	 * safe, and on the server, it reads `session` from the `LayoutData`, which
	 * safely checked the session using `safeGetSession`.
	 */
	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	// If user is signed in and on the root path, redirect to the app dashboard
	if (user && url.pathname === '/') {
		throw redirect(302, '/app');
	}

        return {
                session,
                supabase,
                user,
                sharepointClient
        };
};
