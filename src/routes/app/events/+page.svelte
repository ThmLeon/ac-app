<script lang="ts">
	import EventCard from '@/components/events/EventCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { inview } from 'svelte-inview';
	import { getEventList } from '@/state/EventList.svelte';

	let { data } = $props();
	let { session, supabase } = $derived(data);
	const eventList = $derived(getEventList(data.supabase, data.userId));
</script>

<div class="container mx-auto pt-5">
	<div class="flex justify-between items-center">
		<a href={`./events/neuesEvent`}>
			<Button variant="default">Neues Event hinzufügen</Button>
		</a>

		<div class="flex items-center gap-4">
			<Input
				type="text"
				placeholder="Nach Name filtern..."
				class="w-64"
				bind:value={eventList.filter.textSearch}
				oninput={() => eventList.filterChange()}
			/>

			<Select
				type="single"
				bind:value={eventList.filter.dateFilter}
				onValueChange={() => eventList.filterChange()}
			>
				<SelectTrigger class="w-48"
					>{eventList.filter.dateFilter === 'all'
						? 'Datum'
						: eventList.filter.dateFilter === 'upcoming'
							? 'Kommende Events'
							: 'Vergangene Events'}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="upcoming">Kommende Events</SelectItem>
					<SelectItem value="past">Vergangene Events</SelectItem>
				</SelectContent>
			</Select>

			<Select
				type="single"
				bind:value={eventList.filter.statusFilter}
				onValueChange={() => eventList.filterChange()}
			>
				<SelectTrigger class="w-48"
					>{eventList.filter.statusFilter === 'all'
						? 'Bewerbungsstatus'
						: eventList.filter.statusFilter.charAt(0).toUpperCase() +
							eventList.filter.statusFilter.slice(1)}</SelectTrigger
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
	{#each eventList.events as event, index}
		<EventCard {event} />
		{#if index === eventList.events.length - 4}
			<div
				use:inview
				on:inview_change={(event) => {
					const { inView } = event.detail;
					if (inView && !eventList.isLoading) {
						eventList.loadMoreEvents();
					}
				}}
			></div>
		{/if}
	{/each}

	{#if eventList.isLoading}
		<div class="text-center py-4">
			<p>Lade weitere Events...</p>
		</div>
	{:else if eventList.events.length === 0}
		<div class="text-center py-4">
			<p>Keine Events gefunden.</p>
		</div>
	{/if}
</div>
