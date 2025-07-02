<script lang="ts">
	import EventCard from '@/components/events/EventCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import type { PageServerData } from './$types';

	//TODO: Filter hinzufügen
	//TODO: Pagination oder nachladen einbauen --> sodass nicht alle events geladen werden
	export let data: PageServerData;
</script>

<!-- Filter and Add Event Section -->
<div class="container mx-auto pt-5">
	<div class="flex justify-between items-center">
		<a href={`./events/neuesEvent`}>
			<Button variant="default">Neues Event hinzufügen</Button>
		</a>

		<div class="flex items-center gap-4">
			<Input type="text" placeholder="Nach Name filtern..." class="w-64" />

			<Select type="single">
				<SelectTrigger class="w-48">Datum</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="upcoming">Kommende Events</SelectItem>
					<SelectItem value="past">Vergangene Events</SelectItem>
				</SelectContent>
			</Select>

			<Select type="single">
				<SelectTrigger class="w-48">Bewerbungsstatus</SelectTrigger>
				<SelectContent>
					<SelectItem value="offen">Offene Events</SelectItem>
					<SelectItem value="beworben">Beworben</SelectItem>
					<SelectItem value="besetzt">Besetzt</SelectItem>
					<SelectItem value="anwesend">Anwesend</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
</div>

<!--TODO: if event is empty (none is shown) then show "no event with current filter found"-->
<div class="container mx-auto p-4 space-y-4">
	{#each data.eventsData as event}
		<EventCard
			imageUrl="https://placehold.co/1600x1000"
			title={event.titel}
			description={event.beschreibung}
			startDate={event.start_datum_zeit}
			endDate={event.ende_datum_zeit}
			applicationDeadline={event.bewerbungs_deadline}
			eventBewerbung={event.event_bewerbung}
			masterName={event.event_master.master_name}
			eventId={event.id}
		/>
	{/each}
</div>
