<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { SuperForm, SuperFormData } from 'sveltekit-superforms/client';
	import { type EventMasterForm } from '@/schemas/eventMasterSchema';
	import { FormControl, FormField, FormFieldErrors, FormLabel } from '@/components/ui/form';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Select } from '@/components/ui/select';
	import SelectTrigger from '@/components/ui/select/select-trigger.svelte';
	import SelectContent from '@/components/ui/select/select-content.svelte';
	import SelectItem from '@/components/ui/select/select-item.svelte';

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
	<Sheet.Content side="right" class="min-w-[500px] flex flex-col h-full p-5">
		<form method="POST" class="flex flex-col h-full" use:form.enhance>
			<div class="grow">
				<Sheet.Header>
					<Sheet.Title>
						{$formData.ID ? 'Event Master bearbeiten' : 'Neuen Event Master hinzufügen'}
					</Sheet.Title>
					<Sheet.Description>
						{$formData.ID
							? 'Ändere die Details des Event Masters unten. Klicke auf "Speichern", wenn du fertig bist.'
							: 'Fülle die Details des neuen Event Masters aus. Klicke auf "Hinzufügen", wenn du fertig bist.'}
					</Sheet.Description>
				</Sheet.Header>

				<FormField {form} name="Titel">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Master Name</FormLabel>
							<Input {...props} bind:value={$formData.Titel} />
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

				<FormField {form} name="Eventart">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>Eventart</FormLabel>
							<Select type="single" bind:value={$formData.Eventart} name="Eventart">
								<SelectTrigger class="min-w-40">{$formData.Eventart}</SelectTrigger>
								<SelectContent>
									<SelectItem value="HSM">HSM</SelectItem>
									<SelectItem value="Kuratoren">Kuratoren</SelectItem>
									<SelectItem value="Netzwerk">Netzwerk</SelectItem>
									<SelectItem value="Social">Social</SelectItem>
									<SelectItem value="Sonstiges">Sonstiges</SelectItem>
								</SelectContent>
							</Select>
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="ID">
					<FormControl>
						{#snippet children({ props })}
							<Input {...props} type="hidden" bind:value={$formData.ID} />
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
