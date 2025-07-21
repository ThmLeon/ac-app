<script lang="ts">
	import EventMasterCard from '@/components/events/EventMasterCard.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { PageServerData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventMasterSchema } from '@/schemas/eventMaster';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';

	export let data: PageServerData;

	const eventFormHandler = superForm(data.form, {
		validators: zodClient(eventMasterSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'event_master_form' });
		},
		onResult: ({ result }) => {
			handleActionResultSonners(result, 'event_master_form');
			if (result.type === 'success') {
				showSheet = false;
			}
		}
	});

	const { form, enhance } = eventFormHandler;

	let showSheet = false;

	function onEdit(id: string) {
		const current = data.data.find((eventMaster) => eventMaster.id === id);
		if (current) {
			eventFormHandler.form.set({
				id: current.id,
				master_name: current.master_name,
				beschreibung: current.beschreibung
			});
			showSheet = true;
		}
	}

	function onAddNew() {
		eventFormHandler.form.set({ id: '', master_name: '', beschreibung: '' });
		showSheet = true;
	}
	//TODO Meldungen hinzufügen, wenn es funktioniert hat bzw. nicht funktioniert hat --> mit check, was zurückkommt
</script>

{#await data}
	<PageLoadSkeleton />
{:then data}
	<div class="container mx-auto p-4">
		<div class="flex flex-wrap justify-start gap-4">
			<button
				class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg w-[350px] cursor-pointer"
				title="Neuen Event Master hinzufügen"
				on:click={onAddNew}
			>
				<span class="text-4xl text-gray-400">+</span>
			</button>

			{#each data.data as eventMaster (eventMaster.id)}
				<div class="flex justify-center">
					<EventMasterCard
						id={eventMaster.id}
						onEdit={() => {
							onEdit(eventMaster.id);
						}}
						name={eventMaster.master_name}
						description={eventMaster.beschreibung}
						width="350px"
					/>
				</div>
			{/each}
		</div>

		{#if showSheet}
			<Sheet.Root bind:open={showSheet}>
				<Sheet.Content side="right" class="min-w-[500px] flex flex-col h-full">
					<form method="POST" class="flex flex-col h-full" use:enhance>
						<div class="flex-grow">
							<Sheet.Header>
								<Sheet.Title>
									{$form.id ? 'Event Master bearbeiten' : 'Neuen Event Master hinzufügen'}
								</Sheet.Title>
								<Sheet.Description>
									{$form.id
										? 'Ändere die Details des Event Masters unten. Klicke auf "Speichern", wenn du fertig bist.'
										: 'Fülle die Details des neuen Event Masters aus. Klicke auf "Hinzufügen", wenn du fertig bist.'}
								</Sheet.Description>
							</Sheet.Header>
							<input type="hidden" name="id" bind:value={$form.id} />
							<div class="grid gap-4 py-4">
								<div class="grid grid-cols-4 gap-4 items-center">
									<Label for="master_name" class="col-span-1 text-left">Master Name</Label>
									<Input
										id="master_name"
										name="master_name"
										bind:value={$form.master_name}
										class="col-span-3"
									/>
								</div>
								<div class="grid grid-cols-4 gap-4 items-start">
									<Label for="beschreibung" class="col-span-1 text-left">Beschreibung</Label>
									<textarea
										id="beschreibung"
										name="beschreibung"
										bind:value={$form.beschreibung}
										class="col-span-3 resize-y border rounded p-2"
										rows="4"
									></textarea>
								</div>
							</div>
						</div>
						<Sheet.Footer class="flex justify-end gap-4 mt-4">
							{#if $form.id}
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
		{/if}
	</div>
{/await}
