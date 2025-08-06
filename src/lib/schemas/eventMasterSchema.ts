import { z } from 'zod';
import type { Database } from '@/server/supabase/database.types';

export type EventArt = Database['public']['Enums']['eventart'];
const eventArtEnumValues: EventArt[] = ['HSM', 'Kuratoren', 'Netzwerk', 'Social', 'Sonstiges'];

export const eventMasterSchema = z.object({
	ID: z.number(),
	Titel: z
		.string({ required_error: 'Name darf nicht leer sein' })
		.min(1, 'Name darf nicht leer sein'),
	MasterBeschreibung: z
		.string({ required_error: 'Beschreibung darf nicht leer sein' })
		.min(1, 'Beschreibung darf nicht leer sein'),
	Eventart: z.enum(eventArtEnumValues as [EventArt, ...EventArt[]])
});

export type EventMasterForm = z.infer<typeof eventMasterSchema>;
