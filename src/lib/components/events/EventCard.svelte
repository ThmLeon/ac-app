<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '../ui/card';
	import { Button } from '../ui/button';
	import { Badge } from '../ui/badge'; // Import the ShadCN badge component
	import { formatApplicationDeadline, formatDate } from '@/app.utils';

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

	export let event: EventCardProps;
	export let imageURL: string;

	let status = () => {
		if (!event.eventBewerbungen || event.eventBewerbungen.length === 0) return 'Offen';
		if (event.eventBewerbungen[0].Anwesend) return 'Anwesend';
		if (event.eventBewerbungen[0].Besetzt) return 'Besetzt';
		return 'Beworben';
	};
</script>

<Card class="flex flex-col md:flex-row gap-4">
	<!-- Image Section -->
	<img src={imageURL} alt={event.Titel} class="w-full md:w-1/3 h-auto object-cover rounded-lg" />

	<!-- Content Section -->
	<div class="flex flex-1 flex-col justify-between">
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
				<Badge variant="default">
					{status()}
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
