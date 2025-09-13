<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
	import { Switch } from '@/components/ui/switch';
	import type { PageServerData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventBesetzungAnwesenheitSchema } from '@/schemas/eventBesetzungAnwesenheitSchema';
	import { tick } from 'svelte';
	import EventApplications from '@/components/events/EventApplications.svelte';
	import { isVorstand } from '@/utils/rollen.utils';
	import { goto } from '$app/navigation';

	type EventApplication = {
		ID: number;
		Titel: string | null;
		Besetzt: boolean | null;
		Anwesend: boolean | null;
		BewerbungText: string | null;
		Essgewohnheiten: string | null;
	};

	let { data } = $props();

	$effect(() => {
		if (
			data &&
			!data.isAdmin &&
			!isVorstand(data.roles) &&
			!data.eventData.event_verantwortliche.some((ev: any) => ev.ID === data.userId)
		) {
			goto(`../${data.eventData.ID}`, { replaceState: true });
		}
	});

	let besetzteMitglieder: EventApplication[] = $state(
		data.eventApplications.filter((a) => a.Besetzt)
	); // initial snapshot

	const form = superForm(data.form, {
		validators: zodClient(eventBesetzungAnwesenheitSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', {
				id: 'event_besetzung_anwesenheit_form'
			});
		},
		onResult: async ({ result }) => {
			handleActionResultSonners(result, 'event_besetzung_anwesenheit_form');
			/*if (result.type !== 'failure' && result.status !== 500) {
				await invalidate(`../${data.eventData.ID}`);
				await goto(`../${data.eventData.ID}`, { replaceState: true });
			}*/
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
				{#if data.eventApplications.length === 0}
					<div class="text-sm text-muted-foreground">Keine Bewerbungen vorhanden.</div>
				{/if}
				{#each data.eventApplications as application (application.ID)}
					<div class="flex items-center justify-between rounded-md border px-3 py-2">
						<span>{application.Titel}</span>
						<Switch
							bind:checked={application.Besetzt!}
							onCheckedChange={() => handleBesetztChange(application)}
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
				{#if data.eventApplications.length === 0}
					<div class="text-sm text-muted-foreground">Keine besetzten Mitglieder.</div>
				{:else}
					{#each besetzteMitglieder as application (application.ID)}
						<div class="flex items-center justify-between rounded-md border px-3 py-2">
							<span>{application.Titel}</span>
							<Switch
								bind:checked={application.Anwesend!}
								onCheckedChange={() => handleAnwesendChange(application)}
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
		applications={data.eventApplications}
		eventId={Number(data.eventId)}
	/>
{/await}
