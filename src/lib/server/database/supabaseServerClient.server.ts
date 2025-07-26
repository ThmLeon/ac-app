import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import {createServerClient} from "@supabase/ssr";
import type {RequestEvent} from "@sveltejs/kit";
import type {Database} from "@/server/database/database.types";
import type {SupabaseClient} from "@supabase/supabase-js";

export default class SupabaseServerClient {
  private static instance : SupabaseClient<Database>;

  public static setInstance(event:  RequestEvent): SupabaseClient<Database> {
      SupabaseServerClient.instance = createServerClient<Database>(
          PUBLIC_SUPABASE_URL,
          PUBLIC_SUPABASE_ANON_KEY,
          {cookies: {
            getAll: () => event.cookies.getAll(),
                /**
                 * SvelteKit's cookies API requires `path` to be explicitly set in
                 * the cookie options. Setting `path` to `/` replicates previous/
                 * standard behavior.
                 */
                setAll: (cookiesToSet) => {
                cookiesToSet.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, { ...options, path: '/' });
                });
            }
        }}
      );
    return SupabaseServerClient.instance;
  }

  public static getInstance(): SupabaseClient<Database> {
      if (!SupabaseServerClient.instance) {
            throw new Error('Supabase client instance is not set. Call setInstance() first.');
      }
      return SupabaseServerClient.instance;
  }
}

export function supabaseServerClient() : SupabaseClient<Database> {
    return SupabaseServerClient.getInstance();
}


