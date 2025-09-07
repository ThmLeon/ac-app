import { getAllEventsPaginated } from '@/client/supabase/event';
import type { Database } from '@/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { untrack } from 'svelte';

export type eventsFilterType = {
	textSearch: string;
	dateFilter: 'all' | 'upcoming' | 'past';
	statusFilter: 'all' | 'beworben' | 'besetzt' | 'anwesend';
};

class EventList {
	events: any[] = $state([]);
	isLoading: boolean = $state(false);
	filter: eventsFilterType = $state({
		textSearch: '',
		dateFilter: 'all',
		statusFilter: 'all'
	});
	skip: number = $state(0);
	limit: number = $state(10);
	private userId = $state<number>(-1);
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>, userId: number) {
		this.supabase = supabase;
		this.userId = userId;
		this.loadEvents().then((events) => {
			this.events = events;
		});
	}

	async loadEvents() {
		this.isLoading = true;
		let events = await getAllEventsPaginated(
			this.supabase,
			this.userId,
			this.filter,
			this.skip,
			this.limit
		);
		this.isLoading = false;
		return events;
	}

	async loadMoreEvents() {
		this.skip = this.limit + 1;
		this.limit += 10;
		this.events = [...this.events, ...(await this.loadEvents())];
	}

	async filterChange() {
		this.skip = 0;
		this.limit = 10;
		this.events = await this.loadEvents();
	}
}

let eventList: EventList | null = null;
export function getEventList(supabase: SupabaseClient<Database>, userId: number) {
	if (!eventList) {
		eventList = new EventList(supabase, userId);
	}
	return eventList;
}
