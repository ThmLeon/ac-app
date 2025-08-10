import { z } from 'zod';

export const newEventSchema = z
	.object({
		Titel: z
			.string({
				required_error: 'Titel ist erforderlich.',
				invalid_type_error: 'Titel muss ein Text sein.'
			})
			.min(1, {
				message: 'Titel darf nicht leer sein.'
			}),
		Beschreibung: z
			.string({
				required_error: 'Beschreibung ist erforderlich.',
				invalid_type_error: 'Beschreibung muss ein Text sein.'
			})
			.min(1, {
				message: 'Beschreibung darf nicht leer sein.'
			}),
		MasterEventID: z
			.number({
				required_error: 'Event Master ist erforderlich.',
				invalid_type_error: 'Event Master ID muss eine Zahl sein.'
			})
			.min(0, {
				message: 'Event Master muss angegeben werden.'
			}),
		Beginn: z.preprocess(
			(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
			z.date({
				required_error: 'Startdatum und -zeit ist erforderlich.',
				invalid_type_error: 'Startdatum und -zeit muss ein gültiges Datum sein.'
			})
		),
		Ende: z.preprocess(
			(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
			z.date({
				required_error: 'Enddatum und -zeit ist erforderlich.',
				invalid_type_error: 'Enddatum und -zeit muss ein gültiges Datum sein.'
			})
		),
		Anmeldeart: z
			.enum(['Bewerben', 'Einschreiben', 'FCFS'], {
				required_error: 'Anmeldeart ist erforderlich.',
				invalid_type_error:
					'Anmeldeart muss einer der folgenden Werte sein: Bewerben, Einschreiben, FCFS.'
			})
			.default('Bewerben'),
		FCFSSlots: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.number({ invalid_type_error: 'FCFS Slots müssen eine Zahl sein.' }).min(1).optional()
		),
		Bewerbungsdeadline: z
			.preprocess(
				(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
				z.date({
					required_error: 'Bewerbungs Deadline ist erforderlich.',
					invalid_type_error: 'Bewerbungs Deadline muss ein gültiges Datum sein.'
				})
			)
			.optional(),
		CheckInBeginn: z
			.preprocess(
				(arg) => (typeof arg === 'string' ? new Date(arg) : arg),
				z.date({
					required_error: 'Check-In Beginn ist erforderlich.',
					invalid_type_error: 'Check-In Beginn muss ein gültiges Datum sein.'
				})
			)
			.optional(),
		Semester: z.string({
			required_error: 'Semester ist erforderlich.',
			invalid_type_error: 'Semester muss ein Text sein.'
		}),
		Postleitzahl: z
			.string({
				required_error: 'Postleitzahl ist erforderlich.',
				invalid_type_error: 'Postleitzahl muss eine Zahl sein.'
			})
			.optional(),
		Ort: z
			.string({
				required_error: 'Ort ist erforderlich.',
				invalid_type_error: 'Ort muss ein Text sein.'
			})
			.optional(),
		StrasseHausnummer: z
			.string({
				required_error: 'Straße und Hausnummer sind erforderlich.',
				invalid_type_error: 'Straße und Hausnummer muss ein Text sein.'
			})
			.optional(),
		KostenString: z
			.string({
				required_error: 'Kosten sind erforderlich.',
				invalid_type_error: 'Kosten muss ein Text sein.'
			})
			.optional(),
		KostenEUR: z.number({
			required_error: 'Kosten in Euro sind erforderlich.',
			invalid_type_error: 'Kosten in Euro muss eine Zahl sein.'
		}),
		image: z.instanceof(File).optional(),
		AnlageGewuenscht: z.boolean({
			required_error: 'Bitte angeben, ob ein Anhang benötigt wird.',
			invalid_type_error: 'Anhang Benötigt muss true oder false sein.'
		}),
		AnlageInhalte: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Anhang Beschreibung muss ein Text sein.' }).optional()
		),
		BewerbungstextGewuenscht: z.boolean({
			required_error: 'Bitte angeben, ob ein Bewerbungstext benötigt wird.',
			invalid_type_error: 'Bewerbungstext Benötigt muss true oder false sein.'
		}),
		BewTextVorgabe: z.preprocess(
			(arg) => (arg === '' ? undefined : arg),
			z.string({ invalid_type_error: 'Bewerbungstext Beschreibung muss ein Text sein.' }).optional()
		),
		AngabeEssgewGewuenscht: z.boolean({
			required_error: 'Bitte angeben, ob die Essgewohnheiten angegeben werden sollen.',
			invalid_type_error: 'Angabe der Essgewohnheiten muss true oder false sein.'
		})
	})
	.superRefine((obj, ctx) => {
		if (obj.Anmeldeart === 'FCFS' && !obj.FCFSSlots) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['FCFSSlots'],
				message: 'FCFS Slots sind erforderlich, wenn Anmeldeart FCFS ist'
			});
		}
		if (obj.AnlageGewuenscht && !obj.AnlageInhalte) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['AnlageInhalte'],
				message: 'Anlage Inhalte erforderlich, wenn Anlage gewünscht ist'
			});
		}
		if (obj.BewerbungstextGewuenscht && !obj.BewTextVorgabe) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['BewTextVorgabe'],
				message: 'Bewerbungstext Beschreibung erforderlich, wenn Bewerbungstext benötigt ist'
			});
		}
	});

export type NewEventForm = z.infer<typeof newEventSchema>;
