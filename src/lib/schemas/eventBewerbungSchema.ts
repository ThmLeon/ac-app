import { z } from 'zod';

export const eventBewerbungSchema = z
	.object({
		ID: z.number(),
		Anmeldeart: z.enum(['Bewerben', 'Einschreiben', 'FCFS']),
		BewerbungText: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Bewerbungstext muss ein Text sein.' }).optional()
		),
		Essgewohnheiten: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Essgewohnheiten muss ein Text sein.' }).optional()
		),
		Anlage: z.instanceof(File).optional(),
		BewerbungstextGewuenscht: z.boolean({
			invalid_type_error: 'Bewerbungstext Benötigt muss true oder false sein.'
		}),
		AnlageGewuenscht: z.boolean({
			invalid_type_error: 'Anhang Benötigt muss true oder false sein.'
		}),
		AngabeEssgewGewuenscht: z.boolean({
			invalid_type_error: 'Angabe der Essgewohnheiten muss true oder false sein.'
		})
	})
	.superRefine((obj, ctx) => {
		if (obj.BewerbungstextGewuenscht && !obj.BewerbungText) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['BewerbungText'],
				message: 'Bewerbungstext ist erforderlich.'
			});
		}
		if (obj.AngabeEssgewGewuenscht && !obj.Essgewohnheiten) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['Essgewohnheiten'],
				message: 'Essgewohnheiten sind erforderlich.'
			});
		}
		if (obj.AnlageGewuenscht && !obj.Anlage) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['Anlage'],
				message: 'Anhang ist erforderlich.'
			});
		}
	});

export type EventBewerbungForm = z.infer<typeof eventBewerbungSchema>;
