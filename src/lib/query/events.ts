import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { QueryClient, useInfiniteQuery, useMutation, useQuery } from '@sveltestack/svelte-query';
import { qk } from './keys';
import type { EventsFilterType } from '@/types/events';
import {
	addEventMaster as addEventMasterSupabase,
	deleteEventMaster as deleteEventMasterSupabase,
	deleteEvent as deleteEventSupabase,
	createNewEvent as createNewEventSupabase,
	getAllEventMasters,
	listEventsPaginatedFiltered,
	updateEventMaster as updateEventMasterSupabase,
	getEventDetailsById,
	updateEvent as updateEventSupabase,
	createEventApplication as createEventApplicationSupabase,
	updateEventApplication as updateEventApplicationSupabase,
	deleteEventApplication as deleteEventApplicationSupabase,
	setEventBesetzungAnwesenheit as setEventBesetzungAnwesenheitSupabase,
	getEventApplications
} from '@/api/supabase/events';
import type { SuperValidated } from 'sveltekit-superforms';
import type { EventMasterForm } from '@/schemas/eventMasterSchema';
import { optimisticDeleteArray, optimisticUpdateArray } from '@/utils/utils';
import {
	addEventMaster as addEventMasterSharepoint,
	createNewEvent as createNewEventSharepoint,
	deleteEventMaster as deleteEventMasterSharepoint,
	deleteEvent as deleteEventSharepoint,
	updateEvent as updateEventSharepoint,
	updateEventMaster as updateEventMasterSharepoint,
	createEventApplication as createEventApplicationSharepoint,
	updateEventApplication as updateEventApplicationSharepoint,
	deleteEventApplication as deleteEventApplicationSharepoint,
	setEventBesetzungAnwesenheit as setEventBesetzungAnwesenheitSharepoint
} from '@/api/sharepoint/events';
import type { NewEventForm } from '@/schemas/newEventSchema';
import type { EventBewerbungForm } from '@/schemas/eventBewerbungSchema';
import type { EventBesetzungAnwesenheitForm } from '@/schemas/eventBesetzungAnwesenheitSchema';

export function eventsQueries(
	supabase: SupabaseClient,
	session: Session,
	queryClient: QueryClient
) {
	return {
		listPaginatedFiltered(filter: EventsFilterType, mitgliedID: number, pageSize = 20) {
			const filterSnapshot: EventsFilterType = {
				textSearch: filter.textSearch,
				dateFilter: filter.dateFilter,
				statusFilter: filter.statusFilter
			};
			return useInfiniteQuery({
				queryKey: [
					...qk.events.listPaginatedFiltered(),
					mitgliedID,
					filterSnapshot.textSearch || '',
					filterSnapshot.dateFilter,
					filterSnapshot.statusFilter,
					pageSize
				],
				queryFn: async ({ pageParam = 0 }) => {
					const offset: number = pageParam as number;
					const limitExclusive = offset + pageSize;
					return await listEventsPaginatedFiltered(
						supabase,
						mitgliedID,
						filterSnapshot,
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
		getDetails(eventId: number, mitgliedId: number) {
			return useQuery({
				queryKey: qk.events.details(eventId),
				queryFn: async () => {
					return await getEventDetailsById(supabase, eventId, mitgliedId);
				}
			});
		},
		add() {
			return useMutation(
				async (payload: SuperValidated<NewEventForm>) => {
					const { newEventID, eventVerantwortlicheIDs } = await createNewEventSharepoint(
						supabase,
						session,
						payload.data
					);
					await createNewEventSupabase(
						supabase,
						newEventID!,
						eventVerantwortlicheIDs,
						payload.data
					);
					return newEventID ?? null;
				},
				{
					onSuccess: (newEventID) => {
						queryClient.invalidateQueries({ queryKey: qk.events.listPaginatedFiltered() });
						if (typeof newEventID === 'number') {
							queryClient.invalidateQueries({ queryKey: qk.events.details(newEventID) });
							queryClient.invalidateQueries({ queryKey: qk.events.applications(newEventID) });
						}
					}
				}
			);
		},
		update(eventId: number) {
			return useMutation(
				async (payload: SuperValidated<NewEventForm>) => {
					const eventVerantwortlicheIDs = await updateEventSharepoint(
						supabase,
						session,
						payload.data,
						eventId
					);
					await updateEventSupabase(supabase, payload.data, eventVerantwortlicheIDs, eventId);
					return;
				},
				{
					meta: {
						silent: false,
						loading: 'Event wird aktualisiert...',
						success: 'Event erfolgreich aktualisiert'
					},
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
						queryClient.invalidateQueries({ queryKey: qk.events.listPaginatedFiltered() });
					}
				}
			);
		},
		delete() {
			return useMutation(
				async (eventId: number) => {
					await deleteEventSharepoint(supabase, session, eventId);
					await deleteEventSupabase(supabase, eventId);
				},
				{
					meta: {
						silent: false,
						loading: 'Event wird gelöscht...',
						success: 'Event erfolgreich gelöscht'
					},
					onSuccess: (_, eventId) => {
						queryClient.invalidateQueries({ queryKey: qk.events.listPaginatedFiltered() });
						if (typeof eventId === 'number') {
							queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.applications(eventId) });
						}
					}
				}
			);
		},
		applications: {
			listAll(eventId: number) {
				return useQuery(
					{
						queryKey: qk.events.applications(eventId),
						queryFn: async () => {
							return await getEventApplications(supabase, eventId);
						}
					},
					{
						meta: {
							silent: true
						}
					}
				);
			},
			setBesetzenAnwesenheit(eventId: number) {
				return useMutation(
					async (payload: SuperValidated<EventBesetzungAnwesenheitForm>) => {
						await setEventBesetzungAnwesenheitSharepoint(supabase, session, payload.data);
						await setEventBesetzungAnwesenheitSupabase(supabase, payload.data);
					},
					{
						meta: {
							silent: true
						},
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.applications(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
						}
					}
				);
			},
			create(eventId: number, userTitel: string, userId: number) {
				return useMutation(
					async (payload: SuperValidated<EventBewerbungForm>) => {
						const newApplicationID = await createEventApplicationSharepoint(
							supabase,
							session,
							payload.data,
							eventId,
							userTitel,
							userId
						);
						await createEventApplicationSupabase(
							supabase,
							payload.data,
							newApplicationID,
							userTitel,
							eventId,
							userId
						);
					},
					{
						meta: {
							silent: true
						},
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.applications(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.listPaginatedFiltered() });
						}
					}
				);
			},
			update(eventId: number) {
				return useMutation(
					async (payload: SuperValidated<EventBewerbungForm>) => {
						await updateEventApplicationSharepoint(supabase, session, payload.data);
						await updateEventApplicationSupabase(supabase, payload.data);
					},
					{
						meta: {
							silent: true
						},
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.applications(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
						}
					}
				);
			},
			delete(eventId: number) {
				return useMutation(
					async (applicationId: number) => {
						await deleteEventApplicationSharepoint(supabase, session, applicationId);
						await deleteEventApplicationSupabase(supabase, applicationId);
					},
					{
						meta: {
							silent: true
						},
						onSuccess: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.applications(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.details(eventId) });
							queryClient.invalidateQueries({ queryKey: qk.events.listPaginatedFiltered() });
						}
					}
				);
			}
		},
		masters: {
			listAll() {
				return useQuery({
					queryKey: qk.events.masters(),
					queryFn: async () => {
						return await getAllEventMasters(supabase);
					}
				});
			},
			update() {
				type EventMaster = Awaited<ReturnType<typeof getAllEventMasters>>[0];
				return useMutation(
					async (payload: SuperValidated<EventMasterForm>) => {
						await updateEventMasterSharepoint(supabase, session, payload.data);
						await updateEventMasterSupabase(supabase, payload.data);
						return;
					},
					{
						meta: {
							silent: false,
							loading: 'Event Master wird aktualisiert...',
							success: 'Event Master erfolgreich aktualisiert'
						},
						onMutate: async (payload: SuperValidated<EventMasterForm>) => {
							await optimisticUpdateArray<EventMaster>(
								queryClient,
								qk.events.masters(),
								payload.data,
								(a, b) => b.Eventart?.localeCompare(a.Eventart || '') || 0
							);
						},
						onSettled: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.masters() });
						}
					}
				);
			},
			delete() {
				type EventMaster = Awaited<ReturnType<typeof getAllEventMasters>>[0];
				return useMutation(
					async (ID: number) => {
						await deleteEventMasterSharepoint(supabase, session, ID);
						await deleteEventMasterSupabase(supabase, ID);
						return;
					},
					{
						meta: {
							silent: false,
							loading: 'Event Master wird gelöscht...',
							success: 'Event Master erfolgreich gelöscht'
						},
						onMutate: async (ID: number) => {
							optimisticDeleteArray<EventMaster>(
								queryClient,
								qk.events.masters(),
								ID,
								(a, b) => b.Eventart?.localeCompare(a.Eventart || '') || 0
							);
						},
						onSettled: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.masters() });
						}
					}
				);
			},
			add() {
				return useMutation(
					async (payload: SuperValidated<EventMasterForm>) => {
						const ID = await addEventMasterSharepoint(supabase, session, payload.data);
						await addEventMasterSupabase(supabase, payload.data, ID!);
						return;
					},
					{
						meta: {
							silent: false,
							loading: 'Event Master wird erstellt...',
							success: 'Event Master erfolgreich erstellt'
						},
						onSettled: () => {
							queryClient.invalidateQueries({ queryKey: qk.events.masters() });
						}
					}
				);
			}
		}
	};
}
