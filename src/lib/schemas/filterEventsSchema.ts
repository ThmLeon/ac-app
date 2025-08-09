import { z } from 'zod';

export const filterEventsSchema = z.object({
	skip: z.number().int().min(0).default(0),
	limit: z.number().int().positive().default(10),
	textSearch: z.string().default(''),
	dateFilter: z.enum(['all', 'upcoming', 'past']).default('all'),
	statusFilter: z.enum(['all', 'beworben', 'besetzt', 'anwesend']).default('all')
});

export type FilterEventsSchema = z.infer<typeof filterEventsSchema>;
