import type { MitgliederFilterType } from '@/types/mitglieder';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useInfiniteQuery } from '@sveltestack/svelte-query';
import { qk } from './keys';
import { listMitgliederPaginatedFiltered } from '@/api/supabase/mitglieder';

export function mitgliederQueries(supabase: SupabaseClient) {
	return {
		listPaginatedFiltered(filter: MitgliederFilterType, pageSize = 20) {
			return useInfiniteQuery({
				queryKey: qk.mitglieder.listPaginatedFiltered(),
				queryFn: async ({ pageParam = 0 }) => {
					const offset: number = pageParam as number;
					const limitExclusive = offset + pageSize;
					return await listMitgliederPaginatedFiltered(
						supabase,
						filter,
						offset,
						limitExclusive - 1
					);
				},
				getNextPageParam: (lastPage, allPages) => {
					if (!lastPage || lastPage.length < pageSize) return undefined;
					return allPages.reduce((acc, page) => acc + page.length, 0);
				}
			});
		}
	};
}
