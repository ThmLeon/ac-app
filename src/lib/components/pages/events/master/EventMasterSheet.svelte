<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
	import { type EventMasterForm } from '@/schemas/eventMasterSchema';
	import { FormControl, FormField, FormFieldErrors, FormLabel } from '@/components/ui/form';
	import Textarea from '@/components/ui/textarea/textarea.svelte';

	export let form: SuperForm<EventMasterForm>;
	export let sheetStatus: 'new' | 'edit' | 'hidden';
	let formData: SuperFormData<EventMasterForm> = form.form;

	let sheetOpen = sheetStatus !== 'hidden';
	$: sheetOpen = sheetStatus !== 'hidden';
</script>

<Sheet.Root
	bind:open={sheetOpen}
	onOpenChange={(open) => {
		form.errors.clear();
		if (!open) sheetStatus = 'hidden';
	}}
>
	<Sheet.Content side="right" class="min-w-[500px] flex flex-col h-full">
		<form method="POST" class="flex flex-col h-full" use:form.enhance>
			<div class="flex-grow">
				<Sheet.Header>
					<Sheet.Title>
						{$formData.id ? 'Event Master bearbeiten' : 'Neuen Event Master hinzufügen'}
					</Sheet.Title>
					<Sheet.Description>
						{$formData.id
							? 'Ändere die Details des Event Masters unten. Klicke auf "Speichern", wenn du fertig bist.'
							: 'Fülle die Details des neuen Event Masters aus. Klicke auf "Hinzufügen", wenn du fertig bist.'}
					</Sheet.Description>
				</Sheet.Header>

				<FormField {form} name="Title">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Master Name</FormLabel>
							<Input {...props} bind:value={$formData.Title} />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="MasterBeschreibung">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Beschreibung</FormLabel>
							<Textarea {...props} bind:value={$formData.MasterBeschreibung} />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="id">
					<FormControl>
						{#snippet children({ props })}
							<Input {...props} type="hidden" bind:value={$formData.id} />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>
			</div>
			<Sheet.Footer class="flex justify-end gap-4 mt-4">
				{#if sheetStatus === 'edit'}
					<Button formaction="?/deleteEventMaster" type="submit" variant="destructive"
						>Löschen</Button
					>
					<Button formaction="?/updateEventMaster" type="submit">Speichern</Button>
				{:else}
					<Button formaction="?/addEventMaster" type="submit">Hinzufügen</Button>
				{/if}
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
