<script lang="ts">
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
	import { getMitgliederSelector } from '@/state/MitgliederSelector.svelte';
	import type { Database } from '@/database.types';

	type Mitglied = {
		ID: number;
		Titel: string;
		Art: Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
		Rolle: Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
	};

	let { supabase, selected = $bindable<Mitglied[]>([]) } = $props();
	const mitgliederSelector = getMitgliederSelector(supabase);
	// Initialize internal state from incoming bound value once, then keep syncing state -> prop.
	let initialized = $state(false);
	$effect(() => {
		if (!initialized) {
			if (selected?.length && mitgliederSelector.selected.length === 0) {
				// Seed selector state with incoming selection (preserve parent-provided values)
				mitgliederSelector.selected = [...selected];
			}
			initialized = true;
		}
		// After init, reflect internal state to bound prop (avoids clobbering non-empty incoming selection)
		if (selected !== mitgliederSelector.selected) {
			selected = mitgliederSelector.selected;
		}
	});
</script>

<div class="space-y-3">
	<!-- Search -->
	<div class="relative">
		<Input
			placeholder="Mitglieder suchen..."
			bind:value={mitgliederSelector.query}
			oninput={() => mitgliederSelector.searchMitglied()}
			class="w-full"
		/>

		{#if mitgliederSelector.query.trim().length > 0}
			<div class="absolute z-50 mt-2 w-full">
				<Command class="rounded-md border bg-popover text-popover-foreground shadow-md">
					<CommandList class="max-h-60">
						{#if mitgliederSelector.isLoading}
							<CommandEmpty>Suche...</CommandEmpty>
						{:else if mitgliederSelector.mitglieder.length === 0}
							<CommandEmpty>Keine Treffer</CommandEmpty>
						{/if}
						<CommandGroup heading="Vorschläge">
							<ScrollArea class="max-h-60">
								{#each mitgliederSelector.mitglieder as m (m.ID)}
									<CommandItem
										value={m.Titel || 'Mitglied Name'}
										onclick={() => mitgliederSelector.addMitglied(m)}
									>
										<div class="flex flex-col">
											<span class="font-medium">{m.Titel || 'Mitglied Name'}</span>
											<span class="text-sm text-muted-foreground"
												>{mitgliederStatusAsText(m.Art || 'Aktiv', m.Rolle || 'Mitglied')}</span
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
							onclick={() => mitgliederSelector.removeMitglied(mitglied.ID)}
						>
							<X class="h-4 w-4" />
						</Button>
						<div class="align-middle">
							<MitgliedCard
								name={mitglied.Titel!}
								imageUrl=""
								art={mitglied.Art!}
								rolle={mitglied.Rolle!}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
