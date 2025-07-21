import { z } from 'zod';

export const eventMasterSchema = z.object({
	id: z.string().optional(),
	master_name: z
		.string({ required_error: 'Name darf nicht leer sein' })
		.min(1, 'Name darf nicht leer sein'),
	beschreibung: z
		.string({ required_error: 'Beschreibung darf nicht leer sein' })
		.min(1, 'Beschreibung darf nicht leer sein')
});

export type EventMasterForm = z.infer<typeof eventMasterSchema>;
