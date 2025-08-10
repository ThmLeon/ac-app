<script lang="ts">
	import { formatApplicationDeadline, formatDate } from '@/app.utils';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Badge } from '../ui/badge';
	import { Button } from '../ui/button';

	export let eventData: {
		ID: number;
		Titel: string | null;
		Beschreibung: string | null;
		Beginn: string | null;
		Ende: string | null;
		Bewerbungsdeadline: string | null;
		Ort: string | null;
		StrasseHausnummer: string | null;
		Postleitzahl: string | null;
		BewerbungstextGewuenscht: boolean | null;
		BewTextVorgabe: string | null;
		AnlageGewuenscht: boolean | null;
		AnlageInhalte: string | null;
		AngabeEssgewGewuenscht: string | null;
		event_master: {
			Titel: string | null;
		} | null;
		event_verantwortliche: {
			mitglieder: {
				Vorname: string | null;
				Nachname: string | null;
			} | null;
		}[];
	};
	export let alreadyApplied: {
		ID: number;
		Besetzt: boolean | null;
		Anwesend: boolean | null;
	}[];
	export let bewerbungAktiviert: boolean = false;

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
		if (!alreadyApplied || alreadyApplied.length === 0) {
			if (eventData.Bewerbungsdeadline && new Date(eventData.Bewerbungsdeadline) < new Date()) {
				return { text: 'Deadline abgelaufen & nicht Beworben', variant: 'red' };
			}
			return { text: 'Offen', variant: 'blue' };
		}
		if (alreadyApplied[0].Anwesend) return { text: 'Anwesend', variant: 'green' };
		if (alreadyApplied[0].Besetzt) return { text: 'Besetzt', variant: 'yellow' };
		return { text: 'Beworben', variant: 'orange' };
	}
</script>

<Card class="flex flex-col md:flex-row gap-4">
	<!-- Image Section -->
	<img
		src="https://placehold.co/1600x1000"
		alt={eventData.Titel || 'Event Image'}
		class="w-full md:w-1/3 object-cover rounded-lg aspect-16/10"
	/>

	<!-- Content Section -->
	<div class="flex flex-1 flex-col justify-between">
		<CardHeader>
			<CardTitle>{eventData.Titel || 'Kein Titel'}</CardTitle>
			<CardDescription class="text-sm text-gray-500">
				<strong>Beginn:</strong>
				{formatDate(eventData.Beginn)}<br />
				<strong>Ende:</strong>
				{formatDate(eventData.Ende)}<br />
				<strong>Bewerbungsfrist:</strong>
				{formatApplicationDeadline(eventData.Bewerbungsdeadline)}
			</CardDescription>
		</CardHeader>
		<CardContent class="flex gap-2">
			<Badge variant="default" class={badgeColors[status().variant]}>{status().text}</Badge>
			{#if eventData.event_master && eventData.event_master.Titel}
				<Badge variant="default">
					{eventData.event_master.Titel.charAt(0).toUpperCase() +
						eventData.event_master.Titel.slice(1)}
				</Badge>
			{/if}
		</CardContent>
		<CardContent class="mt-4">
			{#if bewerbungAktiviert}
				<a href={`./${eventData.ID}/bewerben`}>
					<Button variant="default">Jetzt bewerben</Button>
				</a>
			{/if}
		</CardContent>
	</div>
</Card>
