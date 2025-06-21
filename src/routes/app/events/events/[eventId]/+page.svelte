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
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#await data.eventData}
	<h1>Hello Waiting</h1>
{:then eventData}
	<Card class="flex flex-col md:flex-row gap-4">
		<!-- Image Section -->
		<img
			src="https://placehold.co/1600x1000"
			alt={eventData.titel}
			class="w-full md:w-1/3 h-auto object-cover rounded-lg aspect-[16/10]"
		/>

		<!-- Content Section -->
		<div class="flex flex-1 flex-col justify-between">
			<CardHeader>
				<CardTitle>{eventData.titel}</CardTitle>
				<CardDescription class="text-sm text-gray-500">
					<strong>Beginn:</strong>
					{formatDate(eventData.start_datum_zeit)}<br />
					<strong>Ende:</strong>
					{formatDate(eventData.ende_datum_zeit)}<br />
					<strong>Bewerbungsfrist:</strong>
					{formatApplicationDeadline(eventData.bewerbungs_deadline)}
				</CardDescription>
			</CardHeader>
			<CardContent class="flex gap-2">
				<Badge variant="default">Offen</Badge>
				<Badge variant="default">
					{eventData.event_master.master_name.charAt(0).toUpperCase() +
						eventData.event_master.master_name.slice(1)}
				</Badge>
			</CardContent>
			<CardContent class="mt-4">
				<Button variant="default">Jetzt bewerben</Button>
			</CardContent>
		</div>
	</Card>

	<!-- Description Card -->
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

	<!-- Two Side-by-Side Cards -->
	<div class="flex gap-4 w-full">
		<!-- Organizing Team Card -->
		<Card class="flex-1">
			<CardHeader>
				<CardTitle class="text-xl font-bold">Orga-Team</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-4 w-full">
					{#each eventData.event_verantwortliche! as verantwortlicher}
						<div class="flex-shrink-0">
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

		<!-- Location Card -->
		<Card class="w-[350px] flex-shrink-0">
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
