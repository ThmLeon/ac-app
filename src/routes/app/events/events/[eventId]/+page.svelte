<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge'; // Import the ShadCN badge component
	import { Button } from '$lib/components/ui/button'; // Import the button component
	import MitgliedCard from '@/components/general/MitgliedCard.svelte'; // Import MitgliedCard component
	import { formatApplicationDeadline, formatDate, formatTextWithHTML } from '@/app.utils';
	import type { PageData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';

	export let data: PageData;
</script>

{#await data.eventData}
	<PageLoadSkeleton />
{:then eventData}
	<EventDetailsHeader
		{eventData}
		alreadyApplied={data.alreadyApplied}
		bewerbungAktiviert={data.alreadyApplied.length === 0 &&
			!!eventData.Bewerbungsdeadline &&
			new Date(eventData.Bewerbungsdeadline) > new Date()}
	/>
	<Card>
		<CardHeader>
			<CardTitle class="text-xl font-bold">Beschreibung</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-gray-700">
				{@html formatTextWithHTML(eventData.Beschreibung || 'Lädt...')}
			</p>
		</CardContent>
	</Card>

	<div class="flex gap-4 w-full">
		<Card class="flex-1">
			<CardHeader>
				<CardTitle class="text-xl font-bold">Orga-Team</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-4 w-full">
					{#each eventData.event_verantwortliche! as verantwortlicher}
						<div class="shrink-0">
							<MitgliedCard
								name={verantwortlicher?.mitglieder?.Vorname +
									' ' +
									verantwortlicher?.mitglieder?.Nachname}
								imageUrl=""
							/>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>

		<Card class="w-[350px] shrink-0">
			<CardHeader>
				<CardTitle class="text-xl font-bold">Ort</CardTitle>
			</CardHeader>
			<CardContent>
				{eventData.StrasseHausnummer}<br />
				{eventData.Postleitzahl}
				{eventData.Ort}
			</CardContent>
		</Card>
	</div>
{/await}
