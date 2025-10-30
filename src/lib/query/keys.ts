export const qk = {
	mitglieder: {
		listPaginatedFiltered: () => ['mitglieder', 'listPaginatedFiltered'] as const
	},
	events: {
		listPaginatedFiltered: () => ['events', 'listPaginatedFiltered'] as const,
		details: (eventId: number) => ['events', 'details', eventId] as const,
		masters: () => ['events', 'masters'] as const,
		applications: (eventId: number) => ['events', 'applications', eventId] as const
	}
};
