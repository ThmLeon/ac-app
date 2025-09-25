import type { MitgliederFilterType } from '@/types/mitglieder';
import { list } from 'postcss';

export const qk = {
	mitglieder: {
		listPaginatedFiltered: () => ['mitglieder', 'listPaginatedFiltered'] as const
	},
	events: {
		listPaginatedFiltered: () => ['events', 'listPaginatedFiltered'] as const,
		master: () => ['events', 'master'] as const
	}
};
