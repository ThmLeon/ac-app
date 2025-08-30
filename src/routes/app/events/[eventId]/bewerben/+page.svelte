<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { PageData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { goto, invalidate } from '$app/navigation';
	import { FormControl, FormField, FormFieldErrors } from '@/components/ui/form';
	import RequiredLabel from '@/components/general/RequiredLabel.svelte';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventBewerbungSchema, type EventBewerbungForm } from '@/schemas/eventBewerbungSchema';
	import { fileProxy, superForm, type SuperFormData } from 'sveltekit-superforms/client';
	import { eventBewerbungMoeglich } from '@/utils/utils';
	import { page } from '$app/state';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(eventBewerbungSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', {
				id: 'event_bewerbung_form'
			});
		},
		onResult: async ({ result }) => {
			handleActionResultSonners(result, 'event_bewerbung_form');
			if (result.type !== 'failure' && result.status !== 500) {
				await invalidate(`../${data.eventData.ID}`);
				await goto(`../${data.eventData.ID}`, { replaceState: true });
			}
		}
	});

	const { form: formData } = form; // Extract formData
	const file = fileProxy(form, 'Anlage');

	if (data.applicationState) {
		$formData.Essgewohnheiten = data.applicationState.Essgewohnheiten || '';
		$formData.BewerbungText = data.applicationState.BewerbungText || '';
	}
</script>

<form method="POST" class="mt-6 space-y-6" enctype="multipart/form-data" use:form.enhance>
	{#if data.eventData.BewerbungstextGewuenscht}
		<FormField {form} name="BewerbungText">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Bewerbungstext" />
					{#if data.eventData.BewTextVorgabe}
						<p class="text-sm text-gray-500">{data.eventData.BewTextVorgabe}</p>
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

	{#if data.eventData.AngabeEssgewGewuenscht}
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

	{#if data.eventData.AnlageGewuenscht}
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

	<!-- Hidden fields for gewuenscht values -->
	<input
		type="hidden"
		name="BewerbungstextGewuenscht"
		value={data.eventData.BewerbungstextGewuenscht}
	/>
	<input type="hidden" name="AnlageGewuenscht" value={data.eventData.AnlageGewuenscht} />
	<input
		type="hidden"
		name="AngabeEssgewGewuenscht"
		value={data.eventData.AngabeEssgewGewuenscht}
	/>
	<input type="hidden" name="ID" value={data.applicationState?.ID} />
	<input type="hidden" name="Anmeldeart" value={data.eventData.Anmeldeart} />

	{#if data.applicationState}
		<Button formaction="?/updateApplication" type="submit" class="w-full">Bewerbung anpassen</Button
		>
		<Button formaction="?/deleteApplication" type="submit" variant="destructive" class="w-full"
			>Bewerbung zurückziehen</Button
		>
	{:else}
		<Button formaction="?/sendApplication" type="submit" class="w-full">Bewerben</Button>
	{/if}
</form>
