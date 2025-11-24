<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import MitgliedCard from '@/components/general/MitgliedCard.svelte';
	import { formatTextWithHTML } from '@/utils/utils';
	import { getEventContext } from '@/context/eventContext';
	import type { EventDetails } from '@/context/eventContext';

	const { eventDetails } = getEventContext();
</script>

<Card>
	<CardHeader>
		<CardTitle class="text-xl font-bold">Beschreibung</CardTitle>
	</CardHeader>
	<CardContent>
		<p class="text-gray-700">
			{@html formatTextWithHTML($eventDetails?.Beschreibung || 'Lädt...')}
		</p>
	</CardContent>
</Card>

<div class="flex w-full flex-col gap-4 md:flex-row">
	<Card class="flex-1 w-full">
		<CardHeader>
			<CardTitle class="text-xl font-bold">Orga-Team</CardTitle>
		</CardHeader>
		<CardContent>
			{#if $eventDetails?.eventVerantwortliche?.length}
				<div class="flex flex-wrap gap-4 w-full">
					{#each ($eventDetails?.eventVerantwortliche ?? []) as verantwortlicher: EventDetails['eventVerantwortliche'][number] (verantwortlicher.ID)}
						<div class="shrink-0">
							<MitgliedCard
								name={(verantwortlicher.mitglieder?.Vorname ?? '') +
									' ' +
									(verantwortlicher.mitglieder?.Nachname ?? '')}
								imageUrl=""
								art={verantwortlicher.mitglieder?.Art ?? 'Aktiv'}
								rolle={verantwortlicher.mitglieder?.Rolle ?? 'Mitglied'}
							/>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-600">Kein Orga-Team angegeben</p>
			{/if}
		</CardContent>
	</Card>

	<Card class="w-full md:w-[350px] md:shrink-0">
		<CardHeader>
			<CardTitle class="text-xl font-bold">Ort</CardTitle>
		</CardHeader>
		<CardContent>
			{#if $eventDetails && ($eventDetails.StrasseHausnummer || $eventDetails.Postleitzahl || $eventDetails.Ort)}
				{$eventDetails?.StrasseHausnummer}<br />
				{$eventDetails?.Postleitzahl}
				{$eventDetails?.Ort}
			{:else}
				<p class="text-gray-600">Kein Ort angegeben</p>
			{/if}
		</CardContent>
	</Card>
</div>
