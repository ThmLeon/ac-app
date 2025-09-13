<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '../ui/card';
	import EventTitelbildRealistic from '$lib/assets/EventTitelbildRealistic.jpg';
	import { Button } from '../ui/button';
	import { Badge } from '../ui/badge'; // Import the ShadCN badge component
	import { formatApplicationDeadline, formatDate } from '@/app.utils';
	import { onMount } from 'svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '@/database.types';

	type EventCardProps = {
		ID: number;
		Titel: string | null;
		Beschreibung: string | null;
		Beginn: string | null;
		Ende: string | null;
		Bewerbungsdeadline: string | null;
		eventMaster: {
			Titel: string | null;
		} | null;
		eventBewerbungen:
			| {
					ID: number;
					MitgliedID: number | null;
					Besetzt: boolean | null;
					Anwesend: boolean | null;
			  }[]
			| null;
	};
	let { event, supabase } = $props<{
		event: EventCardProps;
		supabase: SupabaseClient<Database>;
	}>();
	let imageURL: string | null = $state(null);
	const badgeColors = {
		blue: 'bg-blue-200 text-blue-800',
		yellow: 'bg-yellow-200 text-yellow-800',
		green: 'bg-green-200 text-green-800',
		orange: 'bg-orange-200 text-orange-800',
		red: 'bg-red-200 text-red-800'
	};
	function status(): {
		text: string;
		variant: 'blue' | 'green' | 'orange' | 'red' | 'yellow';
	} {
		if (!event.eventBewerbungen || event.eventBewerbungen.length === 0) {
			if (event.Bewerbungsdeadline && new Date(event.Bewerbungsdeadline) < new Date()) {
				return { text: 'Deadline abgelaufen & nicht Beworben', variant: 'red' };
			}
			return { text: 'Offen', variant: 'blue' };
		}
		if (event.eventBewerbungen[0].Anwesend) return { text: 'Anwesend', variant: 'green' };
		if (event.eventBewerbungen[0].Besetzt) return { text: 'Besetzt', variant: 'yellow' };
		return { text: 'Beworben', variant: 'orange' };
	}

	async function loadEventImage() {
		const PLACEHOLDER = EventTitelbildRealistic;
		const imageData = await supabase?.storage
			.from('events')
			.createSignedUrls(
				[
					`titelbilder/${event.ID}/${event.ID}.jpg`,
					`titelbilder/${event.ID}/${event.ID}.png`,
					`titelbilder/${event.ID}/${event.ID}.jpeg`
				],
				60 * 60
			);
		if (imageData?.error || !imageData?.data) return PLACEHOLDER;

		for (const entry of imageData.data) {
			if (entry.signedUrl) return entry.signedUrl;
		}
		return PLACEHOLDER;
	}

	onMount(async () => {
		imageURL = await loadEventImage();
	});
</script>

<Card class="flex flex-col md:flex-row gap-4 p-0">
	<!-- Image Section (fixed height + cover crop) -->
	<div class="w-full md:w-1/3 h-64">
		<div class="relative h-full w-full overflow-hidden rounded-lg">
			<img
				src={imageURL}
				alt={event.Titel}
				class="absolute inset-0 h-full w-full object-cover"
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>

	<!-- Content Section -->
	<div class="flex flex-1 flex-col justify-between pt-5 pb-5">
		<CardHeader>
			<CardTitle class="text-lg font-bold">{event.Titel}</CardTitle>
			<CardDescription class="text-sm text-gray-500">
				{#if event.Beschreibung}
					{event.Beschreibung.length > 100
						? `${event.Beschreibung.slice(0, 100)}...`
						: event.Beschreibung}
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="text-sm text-gray-700">
			<p><strong>Beginn:</strong> {event.Beginn ? formatDate(event.Beginn) : '-'}</p>
			<p><strong>Ende:</strong> {event.Ende ? formatDate(event.Ende) : '-'}</p>
			<p>
				<strong>Bewerbungsfrist:</strong>
				{event.Bewerbungsdeadline ? formatApplicationDeadline(event.Bewerbungsdeadline) : '-'}
			</p>
		</CardContent>
		<CardFooter class="flex justify-between items-center">
			<!-- Linke Seite: Badges -->
			<div class="flex gap-2">
				<Badge variant="default" class={badgeColors[status().variant]}>
					{status().text}
				</Badge>
				{#if event.eventMaster?.Titel}
					<Badge variant="default">
						{event.eventMaster.Titel.charAt(0).toUpperCase() + event.eventMaster.Titel.slice(1)}
					</Badge>
				{/if}
			</div>

			<!-- Rechte Seite: Button -->
			<a href={`./events/${event.ID}`}>
				<Button variant="default">Details</Button>
			</a>

			<!-- Navigate to event details -->
		</CardFooter>
	</div>
</Card>
