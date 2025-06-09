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
	import Error from '@/components/general/Error.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	const eventId = page.params.eventId;
	let eventData: Awaited<ReturnType<typeof fetchEventDetails>>['data'] = null;
	let loading = true;
	let error = false;

	async function fetchEventDetails() {
		const { data, error } = await supabase
			.from('04_events_events')
			.select(
				`id, titel, beschreibung, start_datum_zeit, ende_datum_zeit, bewerbungs_deadline, ort_strasse_hausnummer, ort_plz_stadt,
				event_master:04_events_master(master_name),
				event_verantwortliche:04_events_verantwortliche(mitglieder:01_mitglieder_mitglieder(vorname, nachname))`
			)
			.eq('id', eventId)
			.single();

		if (error || data === null) return { data: null, error: true };
		return { data: data, error: false };
	}

	onMount(async () => {
		({ data: eventData, error } = await fetchEventDetails());
		loading = false;
	});
</script>

{#if error}
	<Error />
{:else}
	<Card class="flex flex-col md:flex-row gap-4">
		{#if loading || !eventData}
			<Skeleton class="block w-full md:w-1/3 rounded-lg" />
		{:else}
			<!-- Image Section -->
			<img
				src="https://placehold.co/1600x1000"
				alt={eventData.titel}
				class="w-full md:w-1/3 h-auto object-cover rounded-lg aspect-[16/10]"
			/>
		{/if}

		<!-- Content Section -->
		<div class="flex flex-1 flex-col justify-between">
			<CardHeader>
				{#if loading || !eventData}
					<Skeleton class="h-8 w-3/4 mb-4" />
					<div class="space-y-2">
						<Skeleton class="h-4 w-full" />
						<Skeleton class="h-4 w-full" />
						<Skeleton class="h-4 w-2/3" />
					</div>
				{:else}
					<CardTitle>{eventData.titel}</CardTitle>
					<CardDescription class="text-sm text-gray-500">
						<strong>Beginn:</strong>
						{formatDate(eventData.start_datum_zeit)}<br />
						<strong>Ende:</strong>
						{formatDate(eventData.ende_datum_zeit)}<br />
						<strong>Bewerbungsfrist:</strong>
						{formatApplicationDeadline(eventData.bewerbungs_deadline)}
					</CardDescription>
				{/if}
			</CardHeader>
			<CardContent class="flex gap-2">
				{#if loading || !eventData}
					<Skeleton class="h-6 w-16" />
					<Skeleton class="h-6 w-20" />
				{:else}
					<Badge variant="default">Offen</Badge>
					<Badge variant="default">
						{eventData.event_master.master_name.charAt(0).toUpperCase() +
							eventData.event_master.master_name.slice(1)}
					</Badge>
				{/if}
			</CardContent>
			<CardContent class="mt-4">
				{#if loading || !eventData}
					<Skeleton class="h-10 w-32" />
				{:else}
					<Button variant="default">Jetzt bewerben</Button>
				{/if}
			</CardContent>
		</div>
	</Card>

	<!-- Description Card -->
	<Card>
		<CardHeader>
			{#if loading}
				<Skeleton class="h-6 w-32" />
			{:else}
				<CardTitle class="text-xl font-bold">Beschreibung</CardTitle>
			{/if}
		</CardHeader>
		<CardContent>
			{#if loading || !eventData}
				<div class="space-y-2">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
				</div>
			{:else}
				<p class="text-gray-700">
					{@html formatTextWithHTML(eventData.beschreibung)}
				</p>
			{/if}
		</CardContent>
	</Card>

	<!-- Two Side-by-Side Cards -->
	<div class="flex gap-4 w-full">
		<!-- Organizing Team Card -->
		<Card class="flex-1">
			<CardHeader>
				{#if loading}
					<Skeleton class="h-6 w-24" />
				{:else}
					<CardTitle class="text-xl font-bold">Orga-Team</CardTitle>
				{/if}
			</CardHeader>
			<CardContent>
				{#if loading || !eventData}
					<div class="flex flex-wrap gap-4">
						{#each Array(3) as _}
							<div class="flex items-center gap-2">
								<Skeleton class="h-8 w-8 rounded-lg" />
								<div class="space-y-1">
									<Skeleton class="h-4 w-20" />
									<Skeleton class="h-3 w-16" />
								</div>
							</div>
						{/each}
					</div>
				{:else}
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
				{/if}
			</CardContent>
		</Card>

		<!-- Location Card -->
		<Card class="w-[350px] flex-shrink-0">
			<CardHeader>
				{#if loading || !eventData}
					<Skeleton class="h-6 w-16" />
				{:else}
					<CardTitle class="text-xl font-bold">Ort</CardTitle>
				{/if}
			</CardHeader>
			<CardContent>
				{#if loading || !eventData}
					<Skeleton class="h-4 w-full mb-2" />
					<Skeleton class="h-4 w-2/3" />
				{:else}
					{eventData.ort_strasse_hausnummer}<br />
					{eventData.ort_plz_stadt}
				{/if}
			</CardContent>
		</Card>
	</div>
{/if}
