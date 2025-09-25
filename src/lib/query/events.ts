import type { SupabaseClient } from '@supabase/supabase-js';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from '@sveltestack/svelte-query';
import { qk } from './keys';
import type { EventsFilterType } from '@/types/events';
import {
	deleteEventMaster as deleteEventMasterSupabase,
	getAllEventMasters,
	listEventsPaginatedFiltered,
	updateEventMaster as updateEventMasterSupabase
} from '@/api/supabase/events';
import type { SuperValidated } from 'sveltekit-superforms';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import { optimisticDeleteArray, optimisticUpdateArray } from '@/utils/utils';

export function eventsQueries(supabase: SupabaseClient, queryClient: QueryClient) {
	return {
		listPaginatedFiltered(filter: EventsFilterType, mitgliedID: number, pageSize = 20) {
			return useInfiniteQuery({
				queryKey: qk.events.listPaginatedFiltered(),
				queryFn: async ({ pageParam = 0 }) => {
					const offset: number = pageParam as number;
					const limitExclusive = offset + pageSize;
					return await listEventsPaginatedFiltered(
						supabase,
						mitgliedID,
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
		},
		masters: {
			listAll() {
				return useQuery({
					queryKey: qk.events.master(),
					queryFn: async () => {
						return await getAllEventMasters(supabase);
					}
				});
			},
			update() {
				type EventMaster = Awaited<ReturnType<typeof getAllEventMasters>>[0];
				return useMutation(
					async (payload: SuperValidated<EventMasterForm>) => {
						//await updateEventMasterSharepoint(payload.data);
						await updateEventMasterSupabase(supabase, payload.data);
						return;
					},
					{
						meta: {
							silent: false
						},
						onMutate: async (payload: SuperValidated<EventMasterForm>) => {
							await optimisticUpdateArray<EventMaster>(
								queryClient,
								qk.events.master(),
								payload.data,
								(a, b) => b.Eventart?.localeCompare(a.Eventart || '') || 0
							);
						},
						onSettled: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.master() });
						}
					}
				);
			},
			delete() {
				type EventMaster = Awaited<ReturnType<typeof getAllEventMasters>>[0];
				return useMutation(
					async (ID: number) => {
						//await deleteEventMasterSharepoint(ID);
						await deleteEventMasterSupabase(supabase, ID);
						return;
					},
					{
						meta: {
							silent: false
						},
						onMutate: async (ID: number) => {
							optimisticDeleteArray<EventMaster>(
								queryClient,
								qk.events.master(),
								ID,
								(a, b) => b.Eventart?.localeCompare(a.Eventart || '') || 0
							);
						},
						onSettled: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.master() });
						}
					}
				);
			}
		}
	};
}
