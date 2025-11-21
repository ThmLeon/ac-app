<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
	import { Badge } from '../ui/badge';
	import { Button } from '../ui/button';
	import { page } from '$app/stores';
	import {
		Root as AlertDialog,
		// removed Trigger import to avoid unmount-on-menu-close behavior
		Content as AlertDialogContent,
		Header as AlertDialogHeader,
		Title as AlertDialogTitle,
		Description as AlertDialogDescription,
		Footer as AlertDialogFooter,
		Cancel as AlertDialogCancel,
		Action as AlertDialogAction
	} from '../ui/alert-dialog';
	import { buttonVariants } from '../ui/button/button.svelte';
	import {
		badgeColors,
		eventBewerbungMoeglich,
		formatApplicationDeadline,
		formatDate
	} from '@/utils/utils';
	import EventTitelbildRealistic from '$lib/assets/EventTitelbildRealistic.jpg';
	import { DropdownMenu } from '../ui/dropdown-menu';
	import DropdownMenuTrigger from '../ui/dropdown-menu/dropdown-menu-trigger.svelte';
	import DropdownMenuContent from '../ui/dropdown-menu/dropdown-menu-content.svelte';
	import DropdownMenuItem from '../ui/dropdown-menu/dropdown-menu-item.svelte';
	import { getEventContext } from '@/context/eventContext';
	import { getUserContext } from '@/context/userContext';
	import { getRolesContext } from '@/context/rolesContext';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Session } from '@supabase/supabase-js';
	import { goto } from '$app/navigation';

	const { eventDetails, totalApplications, eventImageURL } = getEventContext();
	const { userDetails } = getUserContext();
	const { userIsAppAdmin } = getRolesContext();

	// Props for supabase client and session
	let { supabase, session }: { supabase: SupabaseClient; session: Session } = $props();

	const queries = eventsQueries(supabase, session, useQueryClient());
	const deleteEventMutation = queries.delete();

	const showApplyOrEditButton = $derived(
		!(
			$page.url.pathname.endsWith('/bewerben') ||
			$page.url.pathname.endsWith('/besetzen') ||
			$page.url.pathname.endsWith('/bearbeiten')
		)
	);

	// control the alert dialog outside the dropdown menu
	let confirmDeleteOpen = $state(false);

	const PLACEHOLDER = EventTitelbildRealistic;

	async function handleDeleteEvent() {
		if ($eventDetails?.ID) {
			await $deleteEventMutation.mutateAsync($eventDetails.ID);
			confirmDeleteOpen = false;
			// Navigate to events list after deletion
			goto('/app/events');
		}
	}

	const bewerbungAktiviert = $derived(
		eventBewerbungMoeglich(
			$eventDetails?.Bewerbungsdeadline ? new Date($eventDetails.Bewerbungsdeadline) : null,
			new Date($eventDetails?.Beginn!),
			$eventDetails?.Anmeldeart!,
			!!$eventDetails?.userBewerbung[0],
			$eventDetails?.FCFSSlots !== undefined &&
				$eventDetails?.FCFSSlots != null &&
				$eventDetails?.FCFSSlots <= $totalApplications
		)
	);

	const isUserEventResponsible = $derived(
		$eventDetails?.eventVerantwortliche.some((v) => v.mitglieder?.ID === $userDetails.ID)
	);

	function status(): {
		text: string;
		variant: 'blue' | 'green' | 'orange' | 'red' | 'yellow';
	} {
		if (!$eventDetails?.userBewerbung[0]) {
			if (
				$eventDetails?.Bewerbungsdeadline &&
				new Date($eventDetails?.Bewerbungsdeadline) < new Date()
			) {
				return { text: 'Deadline abgelaufen & nicht Beworben', variant: 'red' };
			}
			return { text: 'Offen', variant: 'blue' };
		}
		if ($eventDetails.userBewerbung[0].Anwesend) return { text: 'Anwesend', variant: 'green' };
		if ($eventDetails.userBewerbung[0].Besetzt) return { text: 'Besetzt', variant: 'yellow' };
		return { text: 'Beworben', variant: 'orange' };
	}
</script>

<Card class="flex flex-col md:flex-row gap-4 p-0">
	<!-- Image Section -->
	<img
		src={$eventImageURL || PLACEHOLDER}
		alt={$eventDetails?.Titel || 'Event Image'}
		class="w-full md:w-1/3 object-cover rounded-lg aspect-16/10"
	/>

	<!-- Content Section -->
	<div class="flex flex-1 flex-col pt-5 pb-5 gap-4 md:gap-3">
		<CardHeader>
			<CardTitle>{$eventDetails?.Titel || 'Kein Titel'}</CardTitle>
			<CardDescription class="text-sm text-gray-500">
				<strong>Beginn:</strong>
				{formatDate($eventDetails?.Beginn || '')}<br />
				<strong>Ende:</strong>
				{formatDate($eventDetails?.Ende || '')}<br />
				<strong>Bewerbungsdeadline:</strong>
				{formatApplicationDeadline($eventDetails?.Bewerbungsdeadline || '')}<br />
				{#if $eventDetails?.Anmeldeart === 'FCFS'}
					<strong>Plätze:</strong>
					{$totalApplications} von {$eventDetails?.FCFSSlots !== null
						? $eventDetails.FCFSSlots
						: 'unbegrenzt'} belegt
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="mt-4 flex flex-wrap gap-2">
			<Badge variant="default" class={badgeColors[status().variant]}>{status().text}</Badge>
			{#if $eventDetails?.eventMaster && $eventDetails?.eventMaster.Titel}
				<Badge variant="default">
					{$eventDetails.eventMaster.Titel.charAt(0).toUpperCase() +
						$eventDetails.eventMaster.Titel.slice(1)}
				</Badge>
			{/if}
			<Badge variant="default">
				{$eventDetails?.Anmeldeart}
			</Badge>
		</CardContent>

		<!-- Button-Zeile jetzt immer vorhanden, mit fixer Mindesthöhe -->
		<CardContent class="mt-4 flex flex-wrap items-center gap-2" style="min-height:2.5rem;">
			{#if showApplyOrEditButton}
				{#if bewerbungAktiviert.possible || bewerbungAktiviert.modification}
					<a href={`./${$eventDetails?.ID}/bewerben`}>
						<Button variant="default">{bewerbungAktiviert.message}</Button>
					</a>
				{:else}
					<Button variant="default" disabled>{bewerbungAktiviert.message}</Button>
				{/if}
			{/if}
			{#if (isUserEventResponsible || userIsAppAdmin) && showApplyOrEditButton}
				<DropdownMenu>
					<DropdownMenuTrigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline">Event Optionen</Button>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<a href={`./${$eventDetails?.ID}/besetzen`}> Bewerbungen & Besetzung </a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<a href={`./${$eventDetails?.ID}/bearbeiten`}> Event bearbeiten </a>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<button onclick={() => (confirmDeleteOpen = true)}>Event löschen</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}

			<!-- Dedicated AlertDialog outside the dropdown to prevent auto-close -->
			<AlertDialog bind:open={confirmDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Event wirklich löschen?</AlertDialogTitle>
						<AlertDialogDescription>
							Diese Aktion kann nicht rückgängig gemacht werden. Das Event und alle abhängigen Daten
							(z.B. Bewerbungen, Besetzungen) werden dauerhaft entfernt.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Abbrechen</AlertDialogCancel>
						<AlertDialogAction
							class={buttonVariants({ variant: 'destructive' })}
							onclick={handleDeleteEvent}
						>
							Event löschen
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{#if !(showApplyOrEditButton || (isUserEventResponsible && showApplyOrEditButton))}
				<!-- Unsichtbarer Platzhalter, falls absolut keine Buttons -->
				<span class="invisible">
					<Button variant="default">_</Button>
				</span>
			{/if}
		</CardContent>
	</div>
</Card>
