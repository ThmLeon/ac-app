<script lang="ts">
	import EventCard from '@/components/events/EventCard.svelte';
	import type { PageServerData } from './$types';

	//TODO: Filter hinzufügen
	//TODO: Pagination oder nachladen einbauen --> sodass nicht alle events geladen werden
	export let data: PageServerData;
</script>

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
			status="offen"
			masterName={event.event_master.master_name}
			eventId={event.id}
		/>
	{/each}
</div>
