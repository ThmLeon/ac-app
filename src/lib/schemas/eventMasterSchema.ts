import { z } from 'zod';

export const eventMasterSchema = z.object({
	ID: z.number(),
	Titel: z
		.string({ required_error: 'Name darf nicht leer sein' })
		.min(1, 'Name darf nicht leer sein'),
	MasterBeschreibung: z
		.string({ required_error: 'Beschreibung darf nicht leer sein' })
		.min(1, 'Beschreibung darf nicht leer sein')
});

export type EventMasterForm = z.infer<typeof eventMasterSchema>;
