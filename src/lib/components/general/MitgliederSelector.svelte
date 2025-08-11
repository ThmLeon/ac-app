<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandItem,
		CommandList
	} from '$lib/components/ui/command';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import MitgliedCard from '$lib/components/general/MitgliedCard.svelte';
	import { mitgliederStatusAsText } from '@/utils/utils';
	import type { Database } from '@/database.types';

	type Mitglied = {
		ID: number;
		Titel: string;
		Art: Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
		Rolle: Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
	};

	// Full list to search in (client-side for now)
	export let mitglieder: Mitglied[] = [];

	// Bindable selected list
	export let selected: Mitglied[] = [];

	const dispatch = createEventDispatcher<{ change: Mitglied[] }>();

	let search = '';
	let isLoading = false;
	let suggestions: Mitglied[] = [];
	let lastQuery = '';

	function addMitglied(m: Mitglied) {
		if (!selected.some((s) => s.ID === m.ID)) {
			selected = [...selected, m];
			dispatch('change', selected);
		}
		search = '';
		suggestions = [];
	}

	function removeMitglied(id: number) {
		selected = selected.filter((m) => m.ID !== id);
		dispatch('change', selected);
	}

	// Search mitglieder via colocated +server.ts endpoint (POST).
	async function searchMitglied(query: string) {
		const q = query.trim();
		lastQuery = q;
		if (q.length === 0) {
			isLoading = false;
			suggestions = [];
			return;
		}
		isLoading = true;
		try {
			const formData = new FormData();
			formData.set('nameSearch', q);
			const response = await fetch('?/', { method: 'POST', body: formData });
			const json = await response.json();
			// Ignore out-of-date responses
			if (lastQuery !== q) return;
			suggestions = Array.isArray(json?.mitglieder) ? json.mitglieder : [];
		} catch {
			if (lastQuery === q) suggestions = [];
		} finally {
			if (lastQuery === q) isLoading = false;
		}
	}

	// Trigger search on input changes
	$: void searchMitglied(search);
</script>

<div class="space-y-3">
	<!-- Search -->
	<div class="relative">
		<Input placeholder="Mitglieder suchen..." bind:value={search} class="w-full" />

		{#if search.trim().length > 0}
			<div class="absolute z-50 mt-2 w-full">
				<Command class="rounded-md border bg-popover text-popover-foreground shadow-md">
					<CommandList class="max-h-60">
						{#if suggestions.length === 0}
							<CommandEmpty>{isLoading ? 'Suche...' : 'Keine Treffer'}</CommandEmpty>
						{/if}
						<CommandGroup heading="Vorschläge">
							<ScrollArea class="max-h-60">
								{#each suggestions as m (m.ID)}
									<CommandItem value={m.Titel} onclick={() => addMitglied(m)}>
										<div class="flex flex-col">
											<span class="font-medium">{m.Titel}</span>
											<span class="text-sm text-muted-foreground"
												>{mitgliederStatusAsText(m.Art, m.Rolle)}</span
											>
										</div>
									</CommandItem>
								{/each}
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</div>
		{/if}
	</div>

	<!-- Selected -->
	<div class="rounded-md border p-3">
		{#if selected.length === 0}
			<p class="text-sm text-muted-foreground">Noch keine Mitglieder ausgewählt.</p>
		{:else}
			<div class="grid gap-4">
				{#each selected as mitglied (mitglied.ID)}
					<div class="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							class="h-8 w-8 text-destructive align-middle"
							aria-label="Aus Auswahl entfernen"
							onclick={() => removeMitglied(mitglied.ID)}
						>
							<X class="h-4 w-4" />
						</Button>
						<div class="align-middle">
							<MitgliedCard
								name={mitglied.Titel}
								imageUrl=""
								art={mitglied.Art}
								role={mitglied.Rolle}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
