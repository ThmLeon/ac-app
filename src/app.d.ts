import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/server/database/database.types';

type UserDetails = {
	ID: number;
	Vorname: string;
	Nachname: string;
	Titel: string;
};

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			userDetails: UserDetails | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
