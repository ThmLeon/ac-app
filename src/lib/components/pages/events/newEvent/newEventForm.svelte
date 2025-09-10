<script lang="ts">
	import { FormButton, FormControl, FormFieldErrors, FormLabel } from '@/components/ui/form';
	import FormField from '@/components/ui/form/form-field.svelte';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import type { NewEventForm } from '@/schemas/newEventSchema';
	import type { SuperForm } from 'sveltekit-superforms';
	import { fileProxy, type SuperFormData } from 'sveltekit-superforms/client';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { Select, SelectTrigger } from '@/components/ui/select';
	import SelectContent from '@/components/ui/select/select-content.svelte';
	import SelectItem from '@/components/ui/select/select-item.svelte';
	import RequiredLabel from '@/components/general/RequiredLabel.svelte';
	import DateTimePicker from '@/components/general/DateTimePicker.svelte';
	import MitgliederSelector from '@/components/general/MitgliederSelector.svelte';
	import type { Database } from '@/database.types';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import SuperDebug from 'sveltekit-superforms';

	// Mitglieder-Selector: Typ vor Verwendung deklarieren
	type Mitglied = {
		ID: number;
		Titel: string;
		Art: Database['public']['Enums']['MitgliedsstatusAktivPassivEhemalig'];
		Rolle: Database['public']['Enums']['MitgliedsrolleAlumniAnwaerterMitglied'];
	};

	const {
		form,
		eventMasters,
		supabase,
		formAction = '?/createNewEvent',
		// Default to empty array to avoid runtime errors when mapping
		eventVerantwortliche = []
	} = $props<{
		form: SuperForm<NewEventForm>;
		eventMasters: Array<{ ID: number; Titel: string | null; Eventart?: string | null }>;
		supabase: SupabaseClient<Database>;
		formAction?: string;
		eventVerantwortliche?: Mitglied[];
	}>();

	let formData: SuperFormData<NewEventForm> = form.form;
	const file = fileProxy(form, 'image');

	// Lokale Auswahl mit sicherem Default initialisieren
	let selectedMitglieder = $state<Mitglied[]>(eventVerantwortliche ?? []);

	// Sync: lokale Auswahl -> SuperForm Daten in Minimalform
	$effect(() => {
		const list = selectedMitglieder ?? [];
		$formData.EventVerantwortliche = list.map(({ ID, Titel }) => ({ ID, Titel }));
	});

	// MasterEvent Auswahl (UI) als String halten; SuperForm-Daten via Effekt synchronisieren
	let selectedMasterId = $state<string>(
		$formData.MasterEventID ? String($formData.MasterEventID) : ''
	);

	// Wenn sich die Auswahl ändert: MasterEventID (als number) setzen und HSM-Flag ableiten
	$effect(() => {
		if (selectedMasterId) {
			const id = Number(selectedMasterId);
			$formData.MasterEventID = id; // garantiert number
			const art = eventMasters.find((m: any) => m.ID === id)?.Eventart ?? null;
			$formData.IstHSMEvent = (art?.toLowerCase?.() ?? '') === 'hsm';
		} else {
			// Nichts ausgewählt: HSM zurücksetzen, MasterEventID unverändert lassen (vermeidet Typkonflikte)
			$formData.IstHSMEvent = false;
		}
	});
</script>

<form method="POST" enctype="multipart/form-data" use:form.enhance class="space-y-3">
	<h2 class="text-lg font-semibold mb-2">Grundlegende Informationen</h2>
	<FormField {form} name="Titel">
		<FormControl>
			{#snippet children({ props })}
				<RequiredLabel required label="Titel" />
				<Input
					{...props}
					placeholder="z.B. Traineefahrt 2025"
					type="text"
					bind:value={$formData.Titel}
				/>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormField {form} name="MasterEventID">
		<FormControl>
			{#snippet children({ props })}
				<RequiredLabel required label="Event Master" />
				<!-- Hidden input ensures MasterEventID is submitted -->
				<input type="hidden" {...props} value={$formData.MasterEventID ?? ''} />
				<!-- Hidden field for IstHSMEvent so it's submitted -->
				<input type="hidden" name="IstHSMEvent" value={$formData.IstHSMEvent} />

				<Select type="single" bind:value={selectedMasterId}>
					<SelectTrigger class="w-full">
						{#if $formData.MasterEventID}
							{eventMasters.find(
								(m: { ID: number; Titel: string | null }) => m.ID === $formData.MasterEventID
							)?.Titel || 'Event Master auswählen'}
						{:else}
							Event Master auswählen
						{/if}
					</SelectTrigger>
					<SelectContent>
						{#each eventMasters as { ID, Titel }}
							<SelectItem value={String(ID)}>{Titel ?? `#${ID}`}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.IstHSMEvent}
		<FormField {form} name="HSMPoints">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="HSM Punkte" />
					<Input {...props} type="number" placeholder="z.B. 10" bind:value={$formData.HSMPoints} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}
	<FormField {form} name="Beschreibung">
		<FormControl>
			{#snippet children({ props })}
				<RequiredLabel required label="Beschreibung" />
				<Textarea {...props} bind:value={$formData.Beschreibung} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormField {form} name="Anmeldeart">
		<FormControl>
			{#snippet children({ props })}
				<RequiredLabel required label="Anmeldeart" />
				<!-- Sicherstellen, dass der Wert gesendet wird -->
				<input type="hidden" {...props} value={$formData.Anmeldeart ?? ''} />

				<Select type="single" bind:value={$formData.Anmeldeart}>
					<SelectTrigger class="w-full">
						{#if $formData.Anmeldeart === 'Einschreiben'}
							Offene Anmeldung
						{:else if $formData.Anmeldeart === 'Bewerben'}
							Bewerbung benötigt
						{:else if $formData.Anmeldeart === 'FCFS'}
							First-Come, First-Served
						{:else}
							Anmeldeart auswählen
						{/if}
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="Einschreiben">Offene Anmeldung</SelectItem>
						<SelectItem value="Bewerben">Bewerbung benötigt</SelectItem>
						<SelectItem value="FCFS">First-Come, First-Served</SelectItem>
					</SelectContent>
				</Select>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.Anmeldeart === 'FCFS'}
		<FormField {form} name="FCFSSlots">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Verfügbare Plätze" />
					<Input {...props} placeholder="z.B. 20" type="number" bind:value={$formData.FCFSSlots} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}
	<FormField {form} name="KostenString">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Kosten Beschreibung / Erklärung</FormLabel>
				<Input type="text" {...props} bind:value={$formData.KostenString} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormField {form} name="KostenEUR">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Kosten in Euro (ohne € Zeichen, lediglich die Zahl)</FormLabel>
				<Input type="number" {...props} defaultValue={undefined} bind:value={$formData.KostenEUR} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<h2 class="text-lg mt-4 font-semibold mb-2">Daten</h2>
	<div class="grid grid-cols-2 gap-4">
		<FormField {form} name="Beginn">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Startdatum & Uhrzeit" />
					<DateTimePicker {...props} bind:value={$formData.Beginn} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>

		<FormField {form} name="Ende">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Enddatum & Uhrzeit" />
					<DateTimePicker {...props} bind:value={$formData.Ende} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>

		<FormField {form} name="Bewerbungsdeadline">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Bewerbungsdeadline</FormLabel>
					<DateTimePicker {...props} bind:value={$formData.Bewerbungsdeadline} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
		<FormField {form} name="CheckInBeginn">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Check-In Beginn</FormLabel>
					<DateTimePicker {...props} bind:value={$formData.CheckInBeginn} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>
	<h2 class="text-lg font-semibold mb-2">Adresse</h2>
	<div class="grid grid-cols-2 gap-4">
		<FormField {form} name="StrasseHausnummer" class="col-span-2">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Straße & Hausnummer</FormLabel>
					<Input
						{...props}
						placeholder="z.B. Leopoldstraße 62"
						type="text"
						bind:value={$formData.StrasseHausnummer}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
		<FormField {form} name="Postleitzahl">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Postleitzahl</FormLabel>
					<Input
						{...props}
						placeholder="z.B. 80802"
						type="text"
						bind:value={$formData.Postleitzahl}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
		<FormField {form} name="Ort">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Ort</FormLabel>
					<Input {...props} placeholder="z.B. München" type="text" bind:value={$formData.Ort} />
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>

	<h2 class="text-lg mt-4 font-semibold mb-2">
		Orga Team
		<p class="text-red-500 inline" aria-label="required">*</p>
	</h2>
	<FormField {form} name="EventVerantwortliche">
		<FormControl>
			{#snippet children({ props })}
				<input type="hidden" {...props} value={JSON.stringify($formData.EventVerantwortliche)} />
				<MitgliederSelector bind:selected={selectedMitglieder} {supabase} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>

	<h2 class="text-lg mt-4 font-semibold mb-2">Bewerbungsdetails</h2>

	<FormField {form} name="AnlageGewuenscht">
		<FormControl>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox {...props} bind:checked={$formData.AnlageGewuenscht} />
					<RequiredLabel required label="Anhang benötigt (z.B. Lebenslauf)" />
				</div>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.AnlageGewuenscht}
		<FormField {form} name="AnlageInhalte">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Anhang Beschreibung" />
					<Input
						{...props}
						placeholder="z.B. Bitte lade deinen Lebenslauf hoch"
						type="text"
						bind:value={$formData.AnlageInhalte}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}
	<FormField {form} name="BewerbungstextGewuenscht">
		<FormControl>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox {...props} bind:checked={$formData.BewerbungstextGewuenscht} />
					<RequiredLabel required label="Bewerbungstext benötigt" />
				</div>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.BewerbungstextGewuenscht}
		<FormField {form} name="BewTextVorgabe">
			<FormControl>
				{#snippet children({ props })}
					<RequiredLabel required label="Bewerbungstext Beschreibung" />
					<Input
						{...props}
						placeholder="z.B. Beschreibe wie viel Lust du auf das Event hast"
						type="text"
						bind:value={$formData.BewTextVorgabe}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}
	<FormField {form} name="AngabeEssgewGewuenscht">
		<FormControl>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox {...props} bind:checked={$formData.AngabeEssgewGewuenscht} />
					<RequiredLabel required label="Essensgewohnheiten benötigt" />
				</div>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>

	<h2 class="text-lg mt-4 font-semibold mb-2">Bewerbungsdetails</h2>
	<FormField {form} name="image">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Titelbild</FormLabel>
				<Input
					{...props}
					placeholder="z.B. Bitte lade ein Bild hoch"
					type="file"
					accept="image/png, image/jpeg"
					bind:files={$file}
				/>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>

	<FormButton formaction={formAction}>Submit</FormButton>
</form>
