import { z } from 'zod';

export const newEventSchema = z
	.object({
		titel: z
			.string({
				required_error: 'Titel ist erforderlich.',
				invalid_type_error: 'Titel muss ein Text sein.'
			})
			.min(1, {
				message: 'Titel darf nicht leer sein.'
			}),
		beschreibung: z
			.string({
				required_error: 'Beschreibung ist erforderlich.',
				invalid_type_error: 'Beschreibung muss ein Text sein.'
			})
			.min(1, {
				message: 'Beschreibung darf nicht leer sein.'
			}),
		start_datum_zeit: z.preprocess(
			(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
			z.date({
				required_error: 'Startdatum und -zeit ist erforderlich.',
				invalid_type_error: 'Startdatum und -zeit muss ein gültiges Datum sein.'
			})
		),
		ende_datum_zeit: z.preprocess(
			(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
			z.date({
				required_error: 'Enddatum und -zeit ist erforderlich.',
				invalid_type_error: 'Enddatum und -zeit muss ein gültiges Datum sein.'
			})
		),
		bewerbungs_deadline: z.preprocess(
			(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
			z.date({
				required_error: 'Bewerbungs Deadline ist erforderlich.',
				invalid_type_error: 'Bewerbungs Deadline muss ein gültiges Datum sein.'
			})
		),
		image: z.instanceof(File, { message: 'Bitte wähle eine Bilddatei aus' }),
		anhang_benoetigt: z.boolean({
			required_error: 'Bitte angeben, ob ein Anhang benötigt wird.',
			invalid_type_error: 'Anhang Benötigt muss true oder false sein.'
		}),
		anhang_beschreibung: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Anhang Beschreibung muss ein Text sein.' }).optional()
		),
		ort_plz_stadt: z
			.string({
				required_error: 'PLZ und Stadt sind erforderlich.',
				invalid_type_error: 'PLZ und Stadt muss ein Text sein.'
			})
			.min(1, {
				message: 'PLZ und Stadt dürfen nicht leer sein.'
			}),
		ort_strasse_hausnummer: z
			.string({
				required_error: 'Straße und Hausnummer sind erforderlich.',
				invalid_type_error: 'Straße und Hausnummer muss ein Text sein.'
			})
			.min(1, {
				message: 'Straße und Hausnummer dürfen nicht leer sein.'
			}),
		bewerbungstext_benoetigt: z.boolean({
			required_error: 'Bitte angeben, ob ein Bewerbungstext benötigt wird.',
			invalid_type_error: 'Bewerbungstext Benötigt muss true oder false sein.'
		}),
		bewerbungstext_beschreibung: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Bewerbungstext Beschreibung muss ein Text sein.' }).optional()
		)
	})
	.superRefine((obj, ctx) => {
		if (obj.anhang_benoetigt && !obj.anhang_beschreibung) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['anhang_beschreibung'],
				message: 'Anhang Beschreibung erforderlich, wenn Anhang benötigt ist'
			});
		}
		if (obj.bewerbungstext_benoetigt && !obj.bewerbungstext_beschreibung) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['bewerbungstext_beschreibung'],
				message: 'Bewerbungstext Beschreibung erforderlich, wenn Bewerbungstext benötigt ist'
			});
		}
	});

export type NewEventForm = z.infer<typeof newEventSchema>;
