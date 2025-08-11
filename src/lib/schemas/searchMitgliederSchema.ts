import { z } from 'zod';

export const searchMitgliederSchema = z.object({
	nameSearch: z.string().default('')
});

export type SearchMitgliederSchema = z.infer<typeof searchMitgliederSchema>;
