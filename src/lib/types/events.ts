export type EventsFilterType = {
	textSearch: string;
	dateFilter: 'all' | 'upcoming' | 'past';
	statusFilter: 'all' | 'beworben' | 'besetzt' | 'anwesend';
};
