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
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	export let form: SuperForm<EventMasterForm>;
	export let sheetStatus: 'new' | 'edit' | 'hidden';
	let formData: SuperFormData<EventMasterForm> = form.form;
	export let canEdit: boolean;
	export let canDelete: boolean;

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
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<form
			id="event-master-form"
			method="POST"
			class="flex flex-col h-full"
			use:form.enhance
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					const target = e.target as HTMLElement;
					// Prevent submit on Enter unless inside a textarea
					if (!target || target.tagName !== 'TEXTAREA') {
						e.preventDefault();
					}
				}
			}}
		>
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
					<!-- Delete confirmation dialog -->
					{#if $formData.ID}
						<!-- AlertDialog rendered only in edit mode -->
					{/if}

					<!-- Actual buttons -->
					<!-- Delete uses AlertDialog for confirmation -->
					<AlertDialog.Root>
						{#if canDelete}
							<AlertDialog.Trigger type="button" class={buttonVariants({ variant: 'destructive' })}
								>Löschen</AlertDialog.Trigger
							>
						{/if}
						<AlertDialog.Portal>
							<AlertDialog.Overlay class="fixed inset-0 bg-black/50" />
							<AlertDialog.Content
								class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 shadow-lg focus:outline-none"
							>
								<AlertDialog.Header class="mb-4">
									<AlertDialog.Title class="text-lg font-semibold"
										>Event Master löschen?</AlertDialog.Title
									>
									<AlertDialog.Description class="text-sm text-muted-foreground mt-1">
										Diese Aktion kann nicht rückgängig gemacht werden. Der Event Master und alle
										abhängigen Daten, die darauf verweisen, könnten verloren gehen.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer class="flex justify-end gap-2">
									<AlertDialog.Cancel type="button">Abbrechen</AlertDialog.Cancel>
									<AlertDialog.Action
										type="submit"
										name="Action"
										value="delete"
										form="event-master-form"
										class={buttonVariants({ variant: 'destructive' })}
									>
										Löschen
									</AlertDialog.Action>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Portal>
					</AlertDialog.Root>

					{#if canEdit}
						<Button type="submit" name="Action" value="update">Speichern</Button>
					{/if}
				{:else}
					<Button type="submit" name="Action" value="add">Hinzufügen</Button>
				{/if}
			</Sheet.Footer>
		</form>
	</Sheet.Content>
</Sheet.Root>
