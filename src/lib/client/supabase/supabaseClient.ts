import { getContext } from 'svelte';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '@/database.types';

export function useSupabase() {
	return getContext<{ supabase: SupabaseClient<Database> | null; session: Session | null }>(
		'supabase'
	);
}
