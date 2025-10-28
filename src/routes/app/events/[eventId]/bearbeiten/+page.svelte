<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import NewEventForm from '@/components/pages/events/newEvent/newEventForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newEventSchema } from '@/schemas/newEventSchema';
	import { goto } from '$app/navigation';
	import { getRolesContext, Roles } from '@/context/rolesContext';
	import { getEventContext } from '@/context/eventContext';
	import { getUserContext } from '@/context/userContext';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { onMount } from 'svelte';

	const { userHasRole, userIsAppAdmin } = getRolesContext();
	const { eventDetails } = getEventContext();
	const { userDetails } = getUserContext();

	let { data } = $props();

	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const eventMasters = queries.masters.listAll();
	const updateEventMutation = queries.update($eventDetails?.ID || -1);

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(newEventSchema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			// Only trigger mutation after initial prefill is done
			if (form.valid) {
				$updateEventMutation.mutate(form);
			}
		}
	});

	onMount(() => {
		if (
			$eventDetails &&
			!userIsAppAdmin &&
			!userHasRole(Roles.Vorstand) &&
			!$eventDetails.eventVerantwortliche.some((ev: any) => ev.ID === $userDetails.ID)
		) {
			goto(`../${$eventDetails.ID}`, { replaceState: true });
			return;
		}

		// Prefill form with current event details
		if ($eventDetails) {
			const e = $eventDetails;
			const initial = {
				Titel: e.Titel ?? '',
				Beschreibung: e.Beschreibung ?? '',
				MasterEventID: e.MasterEventID ?? 0,
				Beginn: e.Beginn ? new Date(e.Beginn) : new Date(),
				Ende: e.Ende ? new Date(e.Ende) : new Date(),
				Anmeldeart: (e.Anmeldeart as 'Bewerben' | 'Einschreiben' | 'FCFS') ?? 'Bewerben',
				FCFSSlots: e.FCFSSlots ?? undefined,
				Bewerbungsdeadline: e.Bewerbungsdeadline ? new Date(e.Bewerbungsdeadline) : undefined,
				CheckInBeginn: e.CheckInBeginn ? new Date(e.CheckInBeginn) : undefined,
				Semester: e.Semester ?? '',
				Postleitzahl: e.Postleitzahl ?? undefined,
				Ort: e.Ort ?? undefined,
				StrasseHausnummer: e.StrasseHausnummer ?? undefined,
				KostenString: e.KostenString ?? undefined,
				KostenEUR: e.KostenEUR ?? 0,
				image: undefined,
				AnlageGewuenscht: e.AnlageGewuenscht ?? false,
				AnlageInhalte: e.AnlageInhalte ?? undefined,
				BewerbungstextGewuenscht: e.BewerbungstextGewuenscht ?? false,
				BewTextVorgabe: e.BewTextVorgabe ?? undefined,
				AngabeEssgewGewuenscht: e.AngabeEssgewGewuenscht ?? false,
				// Derive HSM flag from master, newEventForm will keep it in sync when MasterEventID changes
				IstHSMEvent: (e.eventMaster?.Eventart?.toLowerCase?.() ?? '') === 'hsm',
				HSMPoints: e.HSMPoints ?? undefined,
				// EventVerantwortliche is controlled by the MitgliederSelector via prop; still set minimal shape here
				EventVerantwortliche:
					e.eventVerantwortliche?.map((v: any) => ({
						ID: v.MitgliedID ?? -1,
						Titel: v.Titel ?? ''
					})) ?? []
			};

			// Set without triggering update mutation
			form.form.set(initial as any);
		}
	});
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<Card>
		<CardHeader>
			<CardTitle class="text-2xl font-bold">Event bearbeiten</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<NewEventForm
				{form}
				eventMasters={$eventMasters.data || []}
				supabase={data.supabase}
				formAction="?/updateEvent"
				eventVerantwortliche={$eventDetails?.eventVerantwortliche.map((ev) => ({
					ID: ev.MitgliedID || -1,
					Titel: ev.Titel || '',
					Art: ev.mitglieder?.Art || 'Aktiv',
					Rolle: ev.mitglieder?.Rolle || 'Mitglied'
				}))}
			/>
		</CardContent>
	</Card>
</div>
