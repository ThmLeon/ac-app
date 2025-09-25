export type MitgliederFilterType = {
	textSearch: string;
	mitgliedsart: Array<'Aktiv' | 'Passiv' | 'Ehemalig'>;
	mitgliedsrolle: Array<'Mitglied' | 'Anwärter' | 'Alumni'>;
	beraterstufe: Array<
		| 'Junior Consultant'
		| 'Consultant'
		| 'Senior Consultant'
		| 'Managing Consultant'
		| 'Director'
		| 'Senior Director'
	>;
	generation: number | null;
};
