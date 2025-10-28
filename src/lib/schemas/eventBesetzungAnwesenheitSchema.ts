import { z } from 'zod';

export const eventBesetzungAnwesenheitSchema = z.object({
	ID: z.number().min(1),
	Besetzt: z.boolean(),
	Anwesend: z.boolean()
});

export type EventBesetzungAnwesenheitForm = z.infer<typeof eventBesetzungAnwesenheitSchema>;
