import { z } from 'zod';

export const feedbackCategories = ['Bug', 'Feature', 'UI', 'Other'] as const;

export const feedbackSchema = z.object({
	Titel: z
		.string({ required_error: 'Titel darf nicht leer sein' })
		.min(1, 'Titel darf nicht leer sein'),
	Kategorie: z.enum(feedbackCategories),
	AppSeite: z
		.string({ required_error: 'App-Seite darf nicht leer sein' })
		.min(1, 'App-Seite darf nicht leer sein'),
	Beschreibung: z
		.string({ required_error: 'Beschreibung darf nicht leer sein' })
		.min(1, 'Beschreibung darf nicht leer sein')
});

export type FeedbackForm = z.infer<typeof feedbackSchema>;
