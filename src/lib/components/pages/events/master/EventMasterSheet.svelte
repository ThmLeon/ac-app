<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { Action } from 'svelte/action';
	import type { Writable } from 'svelte/store';

	export let open: boolean;
	export let form: Writable<any>;
	export let enhance: Action<HTMLFormElement>;
</script>

<Sheet.Root bind:open>
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
