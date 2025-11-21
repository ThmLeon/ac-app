<script lang="ts">
	import EventCard from '@/components/events/EventCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { inview } from 'svelte-inview';
	import type { PageProps } from '../$types';
	import { eventsQueries } from '@/query/events';
	import type { EventsFilterType } from '@/types/events';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { useQueryClient } from '@sveltestack/svelte-query';

	let { data }: PageProps = $props();
	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());

	let eventsFilter: EventsFilterType = $state({
		textSearch: '',
		dateFilter: 'all',
		statusFilter: 'all'
	});

	let events: ReturnType<typeof queries.listPaginatedFiltered> = $state(
		queries.listPaginatedFiltered(eventsFilter, data.userId)
	);

	$effect(() => {
		// re-run query when any filter changes
		eventsFilter.textSearch;
		eventsFilter.dateFilter;
		eventsFilter.statusFilter;
		events = queries.listPaginatedFiltered(eventsFilter, data.userId);
	});

</script>

{#if !$events.data}
	<PageLoadSkeleton />
{:else}
	<div class="container mx-auto pt-5">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<a href={`./events/neuesEvent`}>
				<Button variant="default">Neues Event hinzufügen</Button>
			</a>

			<div class="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
				<Input
					type="text"
					placeholder="Nach Name filtern..."
					class="w-full md:w-64"
					bind:value={eventsFilter.textSearch}
				/>

				<Select type="single" bind:value={eventsFilter.dateFilter}>
					<SelectTrigger class="w-full md:w-48"
						>{eventsFilter.dateFilter === 'all'
							? 'Datum'
							: eventsFilter.dateFilter === 'upcoming'
								? 'Kommende Events'
								: 'Vergangene Events'}</SelectTrigger
					>
					<SelectContent>
						<SelectItem value="all">Alle</SelectItem>
						<SelectItem value="upcoming">Kommende Events</SelectItem>
						<SelectItem value="past">Vergangene Events</SelectItem>
					</SelectContent>
				</Select>

				<Select type="single" bind:value={eventsFilter.statusFilter}>
					<SelectTrigger class="w-full md:w-48"
						>{eventsFilter.statusFilter === 'all'
							? 'Bewerbungsstatus'
							: eventsFilter.statusFilter.charAt(0).toUpperCase() +
								eventsFilter.statusFilter.slice(1)}</SelectTrigger
					>
					<SelectContent>
						<SelectItem value="all">Alle</SelectItem>
						<SelectItem value="beworben">Beworben</SelectItem>
						<SelectItem value="besetzt">Besetzt</SelectItem>
						<SelectItem value="anwesend">Anwesend</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	</div>

	<div class="container mx-auto p-4 space-y-4">
		{#each $events.data.pages as page}
			{#each page as event, index}
				<EventCard {event} supabase={data.supabase} />
				{#if index === page.length - 4}
					<div
						use:inview
						oninview_change={(event) => {
							const { inView } = event.detail;
							if (inView && !$events.isLoading) {
								$events.fetchNextPage();
							}
						}}
					></div>
				{/if}
			{/each}
		{/each}

		{#if $events.isLoading}
			<div class="text-center py-4">
				<p>Lade weitere Events...</p>
			</div>
		{:else if $events.data.pages.length === 0}
			<div class="text-center py-4">
				<p>Keine Events gefunden.</p>
			</div>
		{/if}
	</div>
{/if}
