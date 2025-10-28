<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { FormControl, FormField, FormFieldErrors } from '@/components/ui/form';
	import RequiredLabel from '@/components/general/RequiredLabel.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventBewerbungSchema } from '@/schemas/eventBewerbungSchema';
	import { fileProxy, superForm } from 'sveltekit-superforms/client';
	import { getEventContext } from '@/context/eventContext';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { getUserContext } from '@/context/userContext';

	const { eventDetails } = getEventContext();
	const { userDetails } = getUserContext();

	let { data } = $props();

	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const createEventApplicationMutation = queries.applications.create(
		$eventDetails?.ID || -1,
		$userDetails.Titel!,
		$userDetails.ID
	);
	const updateEventApplicationMutation = queries.applications.update();
	const deleteEventApplicationMutation = queries.applications.delete();

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(eventBewerbungSchema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			if (form.valid) {
				if ($eventDetails && $eventDetails.userBewerbung.length === 0) {
					//user noch nicht beworben -> create
					$createEventApplicationMutation.mutate(form);
				} else {
					//user schon beworben -> update
					$updateEventApplicationMutation.mutate(form);
				}
			}
		}
	});

	const { form: formData } = form; // Extract formData
	const file = fileProxy(form, 'Anlage');

	function handleDeleteApplication(event: MouseEvent) {
		console.log('Deleting application');
		event.preventDefault();
		if ($eventDetails && $eventDetails.userBewerbung.length === 1) {
			const applicationId = $eventDetails.userBewerbung[0].ID;
			$deleteEventApplicationMutation.mutate(applicationId);
		}
	}

	$effect(() => {
		if ($eventDetails) {
			// Set common fields
			$formData.BewerbungstextGewuenscht = $eventDetails.BewerbungstextGewuenscht ?? false;
			$formData.AnlageGewuenscht = $eventDetails.AnlageGewuenscht ?? false;
			$formData.AngabeEssgewGewuenscht = $eventDetails.AngabeEssgewGewuenscht ?? false;
			$formData.Anmeldeart = $eventDetails.Anmeldeart ?? 'Bewerben';

			// Set application-specific fields if updating
			if ($eventDetails.userBewerbung.length === 1) {
				$formData.ID = $eventDetails.userBewerbung[0].ID;
				$formData.Essgewohnheiten = $eventDetails.userBewerbung[0].Essgewohnheiten || '';
				$formData.BewerbungText = $eventDetails.userBewerbung[0].BewerbungText || '';
			} else {
				// New application - ID will be generated server-side
				$formData.ID = 0;
			}
		}
	});
</script>

<form method="POST" class="mt-6 space-y-6" enctype="multipart/form-data" use:form.enhance>
	{#if $eventDetails?.BewerbungstextGewuenscht}
		<FormField {form} name="BewerbungText">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Bewerbungstext" />
					{#if $eventDetails?.BewTextVorgabe}
						<p class="text-sm text-gray-500">{$eventDetails?.BewTextVorgabe}</p>
					{/if}
					<Textarea
						{...props}
						placeholder="Bewerbungstext eingeben..."
						rows={4}
						bind:value={$formData.BewerbungText}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}

	{#if $eventDetails?.AngabeEssgewGewuenscht}
		<FormField {form} name="Essgewohnheiten">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Essgewohnheiten" />
					<Textarea
						{...props}
						placeholder="Essgewohnheiten angeben..."
						rows={4}
						bind:value={$formData.Essgewohnheiten}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}

	{#if $eventDetails?.AnlageGewuenscht}
		<FormField {form} name="Anlage">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Anhang" />
					<Input id={props.id} name={props.name} type="file" accept=".pdf" bind:files={$file} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}

	{#if $eventDetails?.userBewerbung.length === 1}
		<Button type="submit" class="w-full">Bewerbung anpassen</Button>
		<Button type="button" variant="destructive" class="w-full" onclick={handleDeleteApplication}
			>Bewerbung zurückziehen</Button
		>
	{:else}
		<Button type="submit" class="w-full">Bewerben</Button>
	{/if}
</form>
