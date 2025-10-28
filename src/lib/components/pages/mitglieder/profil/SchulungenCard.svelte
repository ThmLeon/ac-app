<script lang="ts">
	import CardBase from './CardBase.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { Badge } from '$lib/components/ui/badge';

	type Schulung = {
		id: string;
		name: string;
		master: string; // Master name
		date: string; // ISO date or date range label
	};

	// Props with defaults (UI only for now)
	export let schulungsleitungen: Schulung[] = [
		{ id: 's1', name: 'Consulting Basics', master: 'Max Mustermann', date: '2024-03-12' },
		{ id: 's2', name: 'Kommunikation Advanced', master: 'Erika Musterfrau', date: '2024-06-01' }
	];
	export let schulungsteilnahmen: Schulung[] = [
		{ id: 't1', name: 'Projektmanagement 101', master: 'Anna Beispiel', date: '2023-11-20' },
		{ id: 't2', name: 'Excel Deep Dive', master: 'Tom Trainer', date: '2024-02-05' },
		{ id: 't3', name: 'Vertrieb Grundlagen', master: 'Lena Coach', date: '2024-07-18' }
	];

	function fmt(d: string) {
		// Accept either an ISO date or a preformatted/range string
		if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
			return new Intl.DateTimeFormat('de-DE').format(new Date(d));
		}
		return d; // already formatted or a range
	}
</script>

<CardBase title="Schulungen">
	<div class="space-y-6">
		<!-- Schulungsleitungen -->
		<div class="space-y-3">
			<h3 class="text-sm font-medium text-muted-foreground">Schulungsleitungen</h3>
			<div class="divide-y rounded-md border">
				{#if schulungsleitungen.length === 0}
					<div class="p-3 text-sm text-muted-foreground">Keine Schulungsleitungen vorhanden.</div>
				{:else}
					{#each schulungsleitungen as s}
						<div class="grid grid-cols-12 gap-2 p-3 text-sm items-center">
							<div class="col-span-6 font-medium truncate">{s.name}</div>
							<div class="col-span-4 flex justify-start">
								<Badge>{s.master}</Badge>
							</div>
							<div class="col-span-2 text-right whitespace-nowrap">{fmt(s.date)}</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<Separator />

		<!-- Schulungsteilnahmen -->
		<div class="space-y-3">
			<h3 class="text-sm font-medium text-muted-foreground">Schulungsteilnahmen</h3>
			<div class="divide-y rounded-md border">
				{#if schulungsteilnahmen.length === 0}
					<div class="p-3 text-sm text-muted-foreground">Keine Schulungsteilnahmen vorhanden.</div>
				{:else}
					{#each schulungsteilnahmen as s}
						<div class="grid grid-cols-12 gap-2 p-3 text-sm items-center">
							<div class="col-span-6 font-medium truncate">{s.name}</div>
							<div class="col-span-4 flex justify-start">
								<Badge>{s.master}</Badge>
							</div>
							<div class="col-span-2 text-right whitespace-nowrap">{fmt(s.date)}</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</CardBase>
