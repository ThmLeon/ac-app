<script lang="ts">
	import { formatApplicationDeadline, formatDate } from '@/app.utils';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Badge } from '../ui/badge';
	import { Button } from '../ui/button';
	import { badgeColors, eventBewerbungMoeglich } from '@/utils/utils';

	export let eventData: {
		ID: number;
		Titel: string | null;
		Beschreibung: string | null;
		Beginn: string | null;
		Ende: string | null;
		Bewerbungsdeadline: string | null;
		Anmeldeart: 'Bewerben' | 'Einschreiben' | 'FCFS' | null;
		FCFSSlots: number | null;
		event_master: {
			Titel: string | null;
		} | null;
		event_verantwortliche: {
			mitglieder: {
				ID: number;
				Vorname: string | null;
				Nachname: string | null;
			} | null;
		}[];
	};
	export let applicationState: {
		Besetzt: boolean | null;
		Anwesend: boolean | null;
	} | null;
	export let totalApplications: number;
	export let showApplyOrEditButton: boolean;
	export let userId: number;

	$: bewerbungAktiviert = eventBewerbungMoeglich(
		eventData.Bewerbungsdeadline ? new Date(eventData.Bewerbungsdeadline) : null,
		new Date(eventData.Beginn!),
		eventData.Anmeldeart!,
		!!applicationState,
		eventData.FCFSSlots !== null && eventData.FCFSSlots <= totalApplications
	);

	$: isUserEventResponsible = eventData.event_verantwortliche.some(
		(verantwortlicher) => verantwortlicher.mitglieder?.ID === userId
	);

	function status(): {
		text: string;
		variant: 'blue' | 'green' | 'orange' | 'red' | 'yellow';
	} {
		if (!applicationState) {
			if (eventData.Bewerbungsdeadline && new Date(eventData.Bewerbungsdeadline) < new Date()) {
				return { text: 'Deadline abgelaufen & nicht Beworben', variant: 'red' };
			}
			return { text: 'Offen', variant: 'blue' };
		}
		if (applicationState.Anwesend) return { text: 'Anwesend', variant: 'green' };
		if (applicationState.Besetzt) return { text: 'Besetzt', variant: 'yellow' };
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
				<strong>Bewerbungsdeadline:</strong>
				{formatApplicationDeadline(eventData.Bewerbungsdeadline)}<br />
				{#if eventData.Anmeldeart === 'FCFS'}
					<strong>Plätze:</strong>
					{totalApplications} von {eventData.FCFSSlots !== null
						? eventData.FCFSSlots
						: 'unbegrenzt'} belegt
				{/if}
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
			<Badge variant="default">
				{eventData.Anmeldeart}
			</Badge>
		</CardContent>
		<CardContent class="flex gap-2">
			{#if showApplyOrEditButton}
				{#if bewerbungAktiviert.possible || bewerbungAktiviert.modification}
					<a href={`./${eventData.ID}/bewerben`}>
						<Button variant="default">{bewerbungAktiviert.message}</Button>
					</a>
				{/if}
				{#if !bewerbungAktiviert.possible && !bewerbungAktiviert.modification}
					<Button variant="default" disabled>{bewerbungAktiviert.message}</Button>
				{/if}
			{/if}
			{#if isUserEventResponsible && showApplyOrEditButton}
				<a href={`./${eventData.ID}/besetzunganwesenheit`}>
					<Button variant="default">Besetzung & Anwesenheit</Button>
				</a>
			{/if}
		</CardContent>
	</div>
</Card>
