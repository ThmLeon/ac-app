<script lang="ts">
	import CardBase from './CardBase.svelte';
	import { Badge } from '$lib/components/ui/badge';

	type EventItem = {
		id: string;
		name: string;
		master: string;
		date: string; // ISO or preformatted range
	};

	// Props with defaults
	export let events: EventItem[] = [
		{ id: 'e1', name: 'Kickoff WS24', master: 'Max Mustermann', date: '2024-10-10' },
		{ id: 'e2', name: 'Strategieworkshop', master: 'Erika Musterfrau', date: '2025-02-18' },
		{ id: 'e3', name: 'Sommerfest', master: 'AC Vorstand', date: '2025-07-05' }
	];

	function fmt(d: string) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
			return new Intl.DateTimeFormat('de-DE').format(new Date(d));
		}
		return d;
	}
</script>

<CardBase title="Events">
	<div class="divide-y rounded-md border">
		{#if events.length === 0}
			<div class="p-3 text-sm text-muted-foreground">Keine Events vorhanden.</div>
		{:else}
			{#each events as e}
				<div class="grid grid-cols-12 gap-2 p-3 text-sm items-center">
					<div class="col-span-7 font-medium truncate">{e.name}</div>
					<div class="col-span-3 flex justify-start">
						<Badge>{e.master}</Badge>
					</div>
					<div class="col-span-2 text-right whitespace-nowrap">{fmt(e.date)}</div>
				</div>
			{/each}
		{/if}
	</div>
</CardBase>
