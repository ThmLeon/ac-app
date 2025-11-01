import type { Database } from '@/api/supabase/database.types';

export type SchulungType = 'Basisschulung' | 'Wahlschulung';

export type SchulungPerson = {
	id: number;
	name: string;
	imageUrl: string;
	art: Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
	rolle: Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
};

export type SchulungApplicationStatus = 'beworben' | 'besetzt' | 'anwesend' | 'offen';

export type SchulungInstanceParticipants = {
	anwesend: SchulungPerson[];
	besetzt: SchulungPerson[];
	bewerbungen: SchulungPerson[];
};

export type SchulungInstanceFeedback = {
	satisfaction: {
		satisfied: number;
		neutral: number;
		unsatisfied: number;
	};
	topics: Array<{
		topic: string;
		distribution: [number, number, number, number, number, number];
		average: number;
	}>;
	positives: string[];
	improvements: string[];
};

export type SchulungInstance = {
	id: number;
	name: string;
	date: string;
	time: string;
	description: string;
	leaders: SchulungPerson[];
	status?: SchulungApplicationStatus;
	isLedByCurrentUser?: boolean;
	masterId?: number;
	masterName?: string;
	participants?: SchulungInstanceParticipants;
	feedback?: SchulungInstanceFeedback;
};

export type SchulungMaster = {
	id: number;
	name: string;
	type: SchulungType;
	description: string;
	teamsWorkspaceUrl: string;
	instances: SchulungInstance[];
};

const makePerson = (
	id: number,
	name: string,
	art: SchulungPerson['art'] = 'Aktiv',
	rolle: SchulungPerson['rolle'] = 'Mitglied'
): SchulungPerson => ({
	id,
	name,
	imageUrl: '',
	art,
	rolle
});

export const schulungenMasters: SchulungMaster[] = [
	{
		id: 1,
		name: 'Digitale Transformation',
		type: 'Basisschulung',
		description:
			'Überblick über die wichtigsten digitalen Trends und deren Auswirkungen auf bestehende Prozesse.',
		teamsWorkspaceUrl: 'https://teams.microsoft.com/l/workplace/digitale-transformation',
		instances: [
			{
				id: 101,
				name: 'Digitale Transformation Frühjahr 2024',
				date: '15.03.2024',
				time: '18:00 Uhr',
				description:
					'Praxisnahe Einführung in kollaborative Tools und Automatisierungsworkflows für bestehende Prozesse.',
				status: 'beworben',
				isLedByCurrentUser: true,
				leaders: [makePerson(1001, 'Anna Fischer'), makePerson(1002, 'Lukas Mayer')],
				participants: {
					anwesend: [makePerson(2001, 'Maximilian Bauer'), makePerson(2002, 'Sarah Lehmann')],
					besetzt: [makePerson(2003, 'Tom Richter'), makePerson(2004, 'Nina Wolf')],
					bewerbungen: [makePerson(2005, 'Felix Brandt')]
				},
				feedback: {
					satisfaction: {
						satisfied: 68,
						neutral: 22,
						unsatisfied: 10
					},
					topics: [
						{
							topic: 'Ich habe in der Schulung etwas Neues gelernt',
							distribution: [32, 28, 18, 12, 7, 3],
							average: 2.3
						},
						{
							topic: 'Die Dauer der Schulung war angemessen',
							distribution: [25, 35, 20, 12, 5, 3],
							average: 2.4
						},
						{
							topic: 'Die Organisation und methodische Durchführung war gut',
							distribution: [30, 33, 18, 10, 6, 3],
							average: 2.2
						},
						{
							topic: 'Die Schulungsleitung war sehr kompetent',
							distribution: [36, 34, 16, 8, 4, 2],
							average: 1.9
						}
					],
					positives: [
						'Sehr gute Praxisbeispiele, die direkt auf unsere Abläufe übertragen werden können.',
						'Die Unterlagen waren übersichtlich und wurden rechtzeitig bereitgestellt.',
						'Interaktive Übungen haben die Inhalte lebendig gemacht.'
					],
					improvements: [
						'Mehr Zeit für Fragen am Ende einplanen.',
						'Ein kurzes Handout mit den wichtigsten Links wäre hilfreich.'
					]
				}
			},
			{
				id: 102,
				name: 'Digitale Transformation Herbst 2024',
				date: '02.10.2024',
				time: '17:00 Uhr',
				description:
					'Vertiefung in Change-Management-Strategien und deren Umsetzung in globalen Teams.',
				status: 'besetzt',
				isLedByCurrentUser: false,
				leaders: [makePerson(1003, 'Clara Schmidt')],
				participants: {
					anwesend: [],
					besetzt: [makePerson(2006, 'Johanna Weiss')],
					bewerbungen: [makePerson(2007, 'Rafael Kurz'), makePerson(2008, 'Isabel Krüger')]
				},
				feedback: {
					satisfaction: {
						satisfied: 55,
						neutral: 30,
						unsatisfied: 15
					},
					topics: [
						{
							topic: 'Ich habe in der Schulung etwas Neues gelernt',
							distribution: [24, 30, 20, 14, 8, 4],
							average: 2.6
						},
						{
							topic: 'Die Dauer der Schulung war angemessen',
							distribution: [18, 28, 24, 16, 9, 5],
							average: 2.9
						},
						{
							topic: 'Die Organisation und methodische Durchführung war gut',
							distribution: [22, 32, 22, 12, 8, 4],
							average: 2.6
						},
						{
							topic: 'Die Schulungsleitung war sehr kompetent',
							distribution: [28, 34, 18, 12, 5, 3],
							average: 2.2
						}
					],
					positives: [
						'Gute Mischung aus Vortrag und Austausch.',
						'Die Schulungsleitung ist auf individuelle Fragen eingegangen.'
					],
					improvements: [
						'Ein stärkerer Fokus auf praktische Übungen wäre wünschenswert.',
						'Beispiele aus anderen Bereichen einbauen, nicht nur IT.'
					]
				}
			}
		]
	},
	{
		id: 2,
		name: 'Agiles Projektmanagement',
		type: 'Wahlschulung',
		description:
			'Einführung in agile Methoden mit praktischen Beispielen und Tools für cross-funktionale Teams.',
		teamsWorkspaceUrl: 'https://teams.microsoft.com/l/workplace/agiles-projektmanagement',
		instances: [
			{
				id: 201,
				name: 'Agiles Projektmanagement Intensivkurs',
				date: '24.04.2024',
				time: '16:30 Uhr',
				description:
					'Intensivkurs zu Scrum und Kanban mit Fokus auf Retrospektiven und kontinuierliche Verbesserung.',
				status: 'anwesend',
				isLedByCurrentUser: false,
				leaders: [makePerson(1004, 'Tim Köhler'), makePerson(1005, 'Maja Hoffmann')],
				participants: {
					anwesend: [makePerson(2010, 'Miriam Hartmann')],
					besetzt: [makePerson(2011, 'Kevin Albrecht')],
					bewerbungen: [makePerson(2012, 'Laura Arnold'), makePerson(2013, 'Niklas Witt')]
				},
				feedback: {
					satisfaction: {
						satisfied: 72,
						neutral: 18,
						unsatisfied: 10
					},
					topics: [
						{
							topic: 'Ich habe in der Schulung etwas Neues gelernt',
							distribution: [40, 30, 15, 8, 5, 2],
							average: 2.0
						},
						{
							topic: 'Die Dauer der Schulung war angemessen',
							distribution: [34, 32, 16, 10, 5, 3],
							average: 2.1
						},
						{
							topic: 'Die Organisation und methodische Durchführung war gut',
							distribution: [38, 34, 16, 7, 3, 2],
							average: 1.9
						},
						{
							topic: 'Die Schulungsleitung war sehr kompetent',
							distribution: [44, 30, 14, 6, 4, 2],
							average: 1.7
						}
					],
					positives: [
						'Sehr strukturierter Aufbau mit klarer Agenda.',
						'Viele praxisnahe Tipps für den Alltag im Projektmanagement.',
						'Die Breakout-Sessions waren besonders hilfreich.'
					],
					improvements: [
						'Die Einführung hätte etwas kürzer sein dürfen.',
						'Bitte zukünftig Pausen klarer kommunizieren.'
					]
				}
			}
		]
	},
	{
		id: 3,
		name: 'Change Management',
		type: 'Basisschulung',
		description:
			'Strategien, um Veränderungsprozesse erfolgreich zu planen, zu begleiten und nachhaltig zu verankern.',
		teamsWorkspaceUrl: 'https://teams.microsoft.com/l/workplace/change-management',
		instances: [
			{
				id: 301,
				name: 'Change Management Sommer 2024',
				date: '18.06.2024',
				time: '19:00 Uhr',
				description:
					'Sommertermin mit Schwerpunkt auf Kommunikation und Stakeholder-Management in Transformationsprojekten.',
				status: 'besetzt',
				isLedByCurrentUser: true,
				leaders: [makePerson(1006, 'Jonas Weber')],
				participants: {
					anwesend: [makePerson(2020, 'Helena Braun')],
					besetzt: [makePerson(2021, 'Sebastian Arnold')],
					bewerbungen: []
				},
				feedback: {
					satisfaction: {
						satisfied: 61,
						neutral: 24,
						unsatisfied: 15
					},
					topics: [
						{
							topic: 'Ich habe in der Schulung etwas Neues gelernt',
							distribution: [28, 30, 22, 10, 6, 4],
							average: 2.5
						},
						{
							topic: 'Die Dauer der Schulung war angemessen',
							distribution: [24, 32, 24, 12, 6, 2],
							average: 2.6
						},
						{
							topic: 'Die Organisation und methodische Durchführung war gut',
							distribution: [30, 28, 20, 12, 6, 4],
							average: 2.4
						},
						{
							topic: 'Die Schulungsleitung war sehr kompetent',
							distribution: [34, 30, 18, 10, 5, 3],
							average: 2.2
						}
					],
					positives: [
						'Gute Beispiele aus realen Projekten.',
						'Die Diskussionen in Kleingruppen waren bereichernd.'
					],
					improvements: [
						'Mehr Zeit für den Praxisteil einplanen.',
						'Bitte die Workshop-Materialien vorab versenden.'
					]
				}
			},
			{
				id: 302,
				name: 'Change Management Winter 2024',
				date: '11.12.2024',
				time: '18:30 Uhr',
				description:
					'Wintertermin mit Lessons Learned aus abgeschlossenen Projekten und Best Practices zur Skalierung.',
				status: 'beworben',
				isLedByCurrentUser: false,
				leaders: [],
				participants: {
					anwesend: [],
					besetzt: [],
					bewerbungen: [makePerson(2022, 'Dominik Krüger')]
				},
				feedback: {
					satisfaction: {
						satisfied: 0,
						neutral: 0,
						unsatisfied: 0
					},
					topics: [],
					positives: [],
					improvements: []
				}
			}
		]
	}
];

export function getSchulungMasterById(id: number) {
	return schulungenMasters.find((master) => master.id === id);
}

export function getSchulungInstanceById(id: number) {
	for (const master of schulungenMasters) {
		const instance = master.instances.find((i) => i.id === id);
		if (instance) {
			return { master, instance };
		}
	}
	return null;
}
