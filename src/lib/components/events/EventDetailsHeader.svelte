<script lang="ts">
	import { formatApplicationDeadline, formatDate } from '@/app.utils';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Badge } from '../ui/badge';
	import { Button } from '../ui/button';

	export let eventData: {
		titel: string;
		id: string;
		start_datum_zeit: string;
		ende_datum_zeit: string;
		bewerbungs_deadline: string;
		event_master: { master_name: string };
	};
	export let eventBewerbung: {
		id: string;
		besetzt: boolean;
		anwesend: boolean;
	}[];
	export let bewerbungAktiviert: boolean = false;

	let status = () => {
		if (eventBewerbung.length === 0) return 'Offen';
		if (eventBewerbung[0].anwesend) return 'Anwesend';
		if (eventBewerbung[0].besetzt) return 'Besetzt';
		return 'Beworben';
	};
</script>

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
			<Badge variant="default">{status()}</Badge>
			<Badge variant="default">
				{eventData.event_master.master_name.charAt(0).toUpperCase() +
					eventData.event_master.master_name.slice(1)}
			</Badge>
		</CardContent>
		<CardContent class="mt-4">
			{#if bewerbungAktiviert}
				<a href={`./${eventData.id}/bewerben`}>
					<Button variant="default">Jetzt bewerben</Button>
				</a>
			{/if}
		</CardContent>
	</div>
</Card>
