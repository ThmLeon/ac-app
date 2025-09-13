import { z } from 'zod';

export const eventDeleteSchema = z.object({
	ID: z.number().min(1)
});

export type EventDeleteSchema = z.infer<typeof eventDeleteSchema>;
