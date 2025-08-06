<!--
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
		eventBewerbung={data.alreadyApplied}
		bewerbungAktiviert={data.alreadyApplied.length === 0}
	/>
	<Card>
		<CardHeader>
			<CardTitle class="text-xl font-bold">Beschreibung</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-gray-700">
				{@html formatTextWithHTML(eventData.beschreibung)}
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
								name={verantwortlicher.mitglieder.vorname +
									' ' +
									verantwortlicher.mitglieder.nachname}
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
				{eventData.ort_strasse_hausnummer}<br />
				{eventData.ort_plz_stadt}
			</CardContent>
		</Card>
	</div>
{/await}
-->
