<script lang="ts">
	import { formatApplicationDeadline, formatDate, handleActionResultSonners } from '@/app.utils';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Badge } from '../ui/badge';
	import { Button } from '../ui/button';
	import {
		Root as AlertDialog,
		Trigger as AlertDialogTrigger,
		Content as AlertDialogContent,
		Header as AlertDialogHeader,
		Title as AlertDialogTitle,
		Description as AlertDialogDescription,
		Footer as AlertDialogFooter,
		Cancel as AlertDialogCancel,
		Action as AlertDialogAction
	} from '../ui/alert-dialog';
	import { buttonVariants } from '../ui/button/button.svelte';
	import { badgeColors, eventBewerbungMoeglich } from '@/utils/utils';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventDeleteSchema } from '@/schemas/eventDeleteSchema';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import EventTitelbildRealistic from '$lib/assets/EventTitelbildRealistic.jpg';

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
	export let eventImageUrl: string | null;
	export let deleteForm: any;

	const deleteEventForm = superForm(deleteForm, {
		validators: zodClient(eventDeleteSchema),
		onSubmit: () => {
			toast.loading('Event wird gelöscht', { id: 'delete_event_form' });
		},
		onResult: async ({ result }) => {
			handleActionResultSonners(result, 'delete_event_form');
			if (result.status !== 500 && result.type === 'success') {
				await goto('../events', { replaceState: true });
			}
		}
	});

	const PLACEHOLDER = EventTitelbildRealistic;

	const { form: deleteEventFormData } = deleteEventForm;

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

<Card class="flex flex-col md:flex-row gap-4 p-0">
	<!-- Image Section -->
	<img
		src={eventImageUrl || PLACEHOLDER}
		alt={eventData.Titel || 'Event Image'}
		class="w-full md:w-1/3 object-cover rounded-lg aspect-16/10"
	/>

	<!-- Content Section -->
	<div class="flex flex-1 flex-col justify-between pt-5 pb-5 h-64">
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

		<!-- Button-Zeile jetzt immer vorhanden, mit fixer Mindesthöhe -->
		<CardContent class="flex gap-2 items-center" style="min-height:2.5rem;">
			{#if showApplyOrEditButton}
				{#if bewerbungAktiviert.possible || bewerbungAktiviert.modification}
					<a href={`./${eventData.ID}/bewerben`}>
						<Button variant="default">{bewerbungAktiviert.message}</Button>
					</a>
				{:else}
					<Button variant="default" disabled>{bewerbungAktiviert.message}</Button>
				{/if}
			{/if}
			{#if isUserEventResponsible && showApplyOrEditButton}
				<a href={`./${eventData.ID}/besetzen`}>
					<Button variant="default">Bewerbungen & Besetzung</Button>
				</a>
				<!-- Delete confirmation dialog -->
				<AlertDialog>
					<AlertDialogTrigger class={buttonVariants({ variant: 'destructive' })} type="button">
						Event löschen
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Event wirklich löschen?</AlertDialogTitle>
							<AlertDialogDescription>
								Diese Aktion kann nicht rückgängig gemacht werden. Das Event und alle abhängigen
								Daten (z.B. Bewerbungen, Besetzungen) werden dauerhaft entfernt.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Abbrechen</AlertDialogCancel>
							<form method="POST" use:deleteEventForm.enhance class="inline">
								<input type="hidden" name="ID" bind:value={$deleteEventFormData.ID} />
								<AlertDialogAction
									class={buttonVariants({ variant: 'destructive' })}
									type="submit"
									formaction="?/deleteEvent"
								>
									Event löschen
								</AlertDialogAction>
							</form>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			{/if}
			{#if !(showApplyOrEditButton || (isUserEventResponsible && showApplyOrEditButton))}
				<!-- Unsichtbarer Platzhalter, falls absolut keine Buttons -->
				<span class="invisible">
					<Button variant="default">_</Button>
				</span>
			{/if}
		</CardContent>
	</div>
</Card>
