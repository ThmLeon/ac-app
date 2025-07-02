<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { CalendarIcon } from 'lucide-svelte';

	let titleImage: FileList | undefined = undefined;
	let description = '';
	let startDateTime = '';
	let endDateTime = '';
	let applicationDeadline = '';
	let attachmentRequired = false;
	let attachmentDescription = '';
	let applicationTextRequired = false;
	let applicationTextDescription = '';
	let locationPostalCode = '';
	let locationStreet = '';

	function handleSubmit() {
		// Handle form submission
		console.log({
			titleImage,
			description,
			startDateTime,
			endDateTime,
			applicationDeadline,
			attachmentRequired,
			attachmentDescription,
			applicationTextRequired,
			applicationTextDescription,
			locationPostalCode,
			locationStreet
		});
	}
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<Card>
		<CardHeader>
			<CardTitle class="text-2xl font-bold">Neues Event erstellen</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Titelbild Upload -->
				<div class="space-y-2">
					<Label for="titleImage">Titelbild</Label>
					<Input
						type="file"
						required
						id="titleImage"
						name="titleImage"
						accept="image/*"
						bind:files={titleImage}
						class="w-full"
					/>
				</div>

				<!-- Beschreibung -->
				<div class="space-y-2">
					<Label for="description">Beschreibung</Label>
					<Textarea
						id="description"
						bind:value={description}
						placeholder="Beschreiben Sie das Event..."
						class="min-h-[100px]"
					/>
				</div>

				<!-- Datum/Zeit Felder -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<h3 class="text-lg font-semibold">Eventzeiten</h3>
					<br />
					<div class="space-y-2">
						<Label for="startDateTime">Start Datum und Zeit</Label>
						<Input
							id="startDateTime"
							type="datetime-local"
							bind:value={startDateTime}
							class="w-110"
						/>
					</div>
					<div class="space-y-2">
						<Label for="endDateTime">Ende Datum und Zeit</Label>
						<Input id="endDateTime" type="datetime-local" bind:value={endDateTime} class="w-110" />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="applicationDeadline">Bewerbungsdeadline</Label>
					<Input
						id="applicationDeadline"
						type="datetime-local"
						bind:value={applicationDeadline}
						class="w-110"
					/>
				</div>

				<!-- Anhang Optionen -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Bewerbungsdaten</h3>
					<div class="flex items-center space-x-2">
						<Checkbox id="attachmentRequired" bind:checked={attachmentRequired} />
						<Label for="attachmentRequired">Anhang benötigt?</Label>
					</div>

					{#if attachmentRequired}
						<div class="space-y-2 ml-6">
							<Label for="attachmentDescription">Anhang Beschreibung</Label>
							<Textarea
								id="attachmentDescription"
								bind:value={attachmentDescription}
								placeholder="Beschreibe was die Bewerber hochladen sollen..."
							/>
						</div>
					{/if}
				</div>

				<!-- Bewerbungstext Optionen -->
				<div class="space-y-4">
					<div class="flex items-center space-x-2">
						<Checkbox id="applicationTextRequired" bind:checked={applicationTextRequired} />
						<Label for="applicationTextRequired">Bewerbungstext benötigt?</Label>
					</div>

					{#if applicationTextRequired}
						<div class="space-y-2 ml-6">
							<Label for="applicationTextDescription">Bewerbungstext Beschreibung</Label>
							<Textarea
								id="applicationTextDescription"
								bind:value={applicationTextDescription}
								placeholder="Beschreibe, was die Bewerber im Bewerbungstext angeben sollen..."
							/>
						</div>
					{/if}
				</div>

				<!-- Ort -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold">Veranstaltungsort</h3>
					<div class="space-y-2">
						<Label for="locationPostalCode">PLZ und Ort</Label>
						<Input
							id="locationPostalCode"
							bind:value={locationPostalCode}
							placeholder="z.B. 80802 München"
						/>
					</div>
					<div class="space-y-2">
						<Label for="locationStreet">Straße und Hausnummer</Label>
						<Input
							id="locationStreet"
							bind:value={locationStreet}
							placeholder="z.B. Musterstraße 123"
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end space-x-4 pt-6">
					<a href="../events">
						<Button variant="outline" type="button">Abbrechen</Button>
					</a>

					<Button type="submit">Event erstellen</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
