<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
	import { Switch } from '@/components/ui/switch';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';
	import { tick } from 'svelte';
	import EventApplications from '@/components/events/EventApplications.svelte';
	import { goto } from '$app/navigation';
	import { getRolesContext, Roles } from '@/context/rolesContext';
	import { getEventContext } from '@/context/eventContext';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';

	type EventApplication = {
		ID: number;
		Titel: string | null;
		Besetzt: boolean | null;
		Anwesend: boolean | null;
		BewerbungText: string | null;
		Essgewohnheiten: string | null;
	};

	const { userHasRole, userIsAppAdmin } = getRolesContext();
	const { eventDetails } = getEventContext();
	let { data } = $props();

	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const eventApplications = queries.applications.listAll($eventDetails?.ID ?? -1);
	const setApplicationBesetztAnwesendMutation = queries.applications.setBesetzenAnwesenheit();

	$effect(() => {
		if (
			data &&
			!userIsAppAdmin &&
			!userHasRole(Roles.Vorstand) &&
			!$eventDetails?.eventVerantwortliche.some((ev) => ev.ID === data.userId)
		) {
			goto(`../${$eventDetails?.ID}`, { replaceState: true });
		}
	});

	let besetzteMitglieder: EventApplication[] = $state([]);

	// Initialize besetzteMitglieder when query data loads
	$effect(() => {
		if ($eventApplications?.data) {
			besetzteMitglieder = $eventApplications.data.filter((a) => a.Besetzt);
		}
	});

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(eventBesetzungAnwesenheitSchema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			if (form.valid) {
				$setApplicationBesetztAnwesendMutation.mutate(form);
			}
		}
	});

	const { form: formData } = form; // superform store

	async function handleBesetztChange(application: EventApplication) {
		$formData.ID = Number(application.ID);
		$formData.Besetzt = application.Besetzt ?? false;
		$formData.Anwesend = false;

		// Optimistic update with immutable reassignment (push/filter alone is not reactive)
		if ($formData.Besetzt) {
			if (!besetzteMitglieder.some((a) => a.ID === application.ID)) {
				besetzteMitglieder = [...besetzteMitglieder, application];
			}
		} else {
			besetzteMitglieder = besetzteMitglieder.filter((a) => a.ID !== application.ID);
		}

		await tick();
		form.submit();
	}

	async function handleAnwesendChange(application: EventApplication) {
		$formData.ID = Number(application.ID);
		$formData.Anwesend = application.Anwesend ?? false;
		$formData.Besetzt = true;
		// ensure member is in besetzteMitglieder if somehow missing
		if (!besetzteMitglieder.some((a) => a.ID === application.ID)) {
			besetzteMitglieder = [...besetzteMitglieder, application];
		}
		await tick();
		form.submit();
	}
</script>

{#await data}
	<PageLoadSkeleton />
{:then data}
	<form method="POST" action="?/setBesetztAnwesend" use:form.enhance>
		<input type="hidden" name="ID" bind:value={$formData.ID} />
		<input type="hidden" name="Besetzt" bind:value={$formData.Besetzt} />
		<input type="hidden" name="Anwesend" bind:value={$formData.Anwesend} />
	</form>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
		<Card>
			<CardHeader>
				<CardTitle>Besetzung</CardTitle>
			</CardHeader>
			<CardContent class="space-y-2">
				{#if $eventApplications?.data?.length === 0}
					<div class="text-sm text-muted-foreground">Keine Bewerbungen vorhanden.</div>
				{/if}
				{#each $eventApplications?.data as application (application.ID)}
					<div class="flex items-center justify-between rounded-md border px-3 py-2">
						<span>{application.Titel}</span>
						<Switch
							checked={application.Besetzt ?? false}
							onCheckedChange={(checked) => {
								application.Besetzt = checked;
								handleBesetztChange(application);
							}}
						/>
					</div>
				{/each}
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Anwesenheit</CardTitle>
			</CardHeader>
			<CardContent class="space-y-2">
				{#if $eventApplications?.data?.length === 0}
					<div class="text-sm text-muted-foreground">Keine besetzten Mitglieder.</div>
				{:else}
					{#each besetzteMitglieder as application (application.ID)}
						<div class="flex items-center justify-between rounded-md border px-3 py-2">
							<span>{application.Titel}</span>
							<Switch
								checked={application.Anwesend ?? false}
								onCheckedChange={(checked) => {
									application.Anwesend = checked;
									handleAnwesendChange(application);
								}}
							/>
						</div>
					{/each}
				{/if}
			</CardContent>
		</Card>
	</div>
	<div class="mb-2"></div>
	<EventApplications
		supabase={data.supabase}
		applications={$eventApplications?.data ?? []}
		eventId={Number(data.eventId)}
	/>
{/await}
