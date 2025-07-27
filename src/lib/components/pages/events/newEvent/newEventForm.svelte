<script lang="ts">
	import { FormButton, FormControl, FormFieldErrors, FormLabel } from '@/components/ui/form';
	import FormField from '@/components/ui/form/form-field.svelte';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import type { NewEventForm } from '@/schemas/newEventSchema';
	import type { SuperForm } from 'sveltekit-superforms';
	import { fileProxy, type SuperFormData } from 'sveltekit-superforms/client';

	export let form: SuperForm<NewEventForm>;

	let formData: SuperFormData<NewEventForm> = form.form;
	const file = fileProxy(form, 'image');
</script>

<form method="POST" enctype="multipart/form-data" use:form.enhance class="space-y-3">
	<h2 class="text-lg font-semibold mb-2">Grundlegende Informationen</h2>
	<FormField {form} name="titel">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Titel</FormLabel>
				<Input
					{...props}
					placeholder="z.B. Traineefahrt 2025"
					type="text"
					bind:value={$formData.titel}
				/>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<FormField {form} name="beschreibung">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Beschreibung</FormLabel>
				<Input {...props} type="text" bind:value={$formData.beschreibung} />
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<h2 class="text-lg mt-4 font-semibold mb-2">Daten</h2>
	<div class="grid grid-cols-2 gap-4">
		<FormField {form} name="start_datum_zeit">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Startdatum & Uhrzeit</FormLabel>
					<Input
						{...props}
						type="datetime-local"
						class="w-auto"
						bind:value={$formData.start_datum_zeit}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>

		<FormField {form} name="ende_datum_zeit">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Enddatum & Uhrzeit</FormLabel>
					<Input
						{...props}
						type="datetime-local"
						class="w-auto"
						bind:value={$formData.ende_datum_zeit}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>

	<FormField {form} name="bewerbungs_deadline">
		<FormControl>
			{#snippet children({ props })}
				<FormLabel>Bewerbungsdeadline</FormLabel>
				<Input
					{...props}
					type="datetime-local"
					class="w-auto"
					bind:value={$formData.bewerbungs_deadline}
				/>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	<h2 class="text-lg font-semibold mb-2">Ort</h2>
	<div class="grid grid-cols-2 gap-4">
		<FormField {form} name="ort_plz_stadt">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>PLZ & Stadt</FormLabel>
					<Input
						{...props}
						placeholder="z.B. 80802 München"
						type="text"
						bind:value={$formData.ort_plz_stadt}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
		<FormField {form} name="ort_strasse_hausnummer">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Straße & Hausnummer</FormLabel>
					<Input
						{...props}
						placeholder="z.B. Leopoldstraße 62"
						type="text"
						bind:value={$formData.ort_strasse_hausnummer}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>

	<h2 class="text-lg mt-4 font-semibold mb-2">Bewerbungsdetails</h2>

	<FormField {form} name="anhang_benoetigt">
		<FormControl>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox {...props} bind:checked={$formData.anhang_benoetigt} />
					<FormLabel>Anhang benötigt (z.B. Lebenslauf)</FormLabel>
				</div>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.anhang_benoetigt}
		<FormField {form} name="anhang_beschreibung">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Anhang Beschreibung</FormLabel>
					<Input
						{...props}
						placeholder="z.B. Bitte lade deinen Lebenslauf hoch"
						type="text"
						bind:value={$formData.anhang_beschreibung}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}
	<FormField {form} name="bewerbungstext_benoetigt">
		<FormControl>
			{#snippet children({ props })}
				<div class="flex items-center space-x-2">
					<Checkbox {...props} bind:checked={$formData.bewerbungstext_benoetigt} />
					<FormLabel>Bewerbungstext benötigt</FormLabel>
				</div>
			{/snippet}
		</FormControl>
		<FormFieldErrors />
	</FormField>
	{#if $formData.bewerbungstext_benoetigt}
		<FormField {form} name="bewerbungstext_beschreibung">
			<FormControl>
				{#snippet children({ props })}
					<FormLabel>Bewerbungstext Beschreibung</FormLabel>
					<Input
						{...props}
						placeholder="z.B. Beschreibe wie viel Lust du auf das Event hast"
						type="text"
						bind:value={$formData.bewerbungstext_beschreibung}
					/>
				{/snippet}
			</FormControl>
			<FormFieldErrors />
		</FormField>
	{/if}

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

	<FormButton formaction="?/createNewEvent">Submit</FormButton>
</form>
