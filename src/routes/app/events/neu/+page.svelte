<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { CalendarIcon } from 'lucide-svelte';
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';

	let eventtitel = '';
	let eventmaster = '';
	let startDatum = new Date();
	let startZeit = '';
	let endeDatum = new Date();
	let endeZeit = '';
	let bewerbungsDeadline = new Date();
	let bewerbungsZeit = '';
	let ortStrasse = '';
	let ortPlzStadt = '';

	const eventmasterOptionen = ['Max Mustermann', 'Anna Schmidt', 'Peter Weber', 'Lisa Müller'];

	function handleSubmit() {
		const eventData = {
			eventtitel,
			eventmaster,
			startDatum: new Date(`${format(startDatum, 'yyyy-MM-dd')}T${startZeit}`),
			endeDatum: new Date(`${format(endeDatum, 'yyyy-MM-dd')}T${endeZeit}`),
			bewerbungsDeadline: new Date(`${format(bewerbungsDeadline, 'yyyy-MM-dd')}T${bewerbungsZeit}`),
			ortStrasse,
			ortPlzStadt
		};
		// Hier würde die API-Anfrage stehen
	}
</script>

<div class="container mx-auto py-8 px-4">
	<Card class="max-w-2xl mx-auto">
		<CardHeader>
			<CardTitle class="text-2xl font-bold">Neues Event erstellen</CardTitle>
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Event Titel -->
				<div class="space-y-2">
					<Label for="eventtitel">Event Titel</Label>
					<Input
						id="eventtitel"
						bind:value={eventtitel}
						placeholder="Geben Sie den Event-Titel ein"
						required
					/>
				</div>

				<!-- Eventmaster Auswahl -->
				<div class="space-y-2">
					<Label for="eventmaster">Eventmaster</Label>
					<Select.Root bind:value={eventmaster}>
						<Select.Trigger class="w-full">
							<Select.Value placeholder="Eventmaster auswählen" />
						</Select.Trigger>
						<Select.Content>
							{#each eventmasterOptionen as option}
								<Select.Item value={option}>{option}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Start Datum und Zeit -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label>Start Datum</Label>
						<Popover>
							<PopoverTrigger>
								<Button variant="outline" class="w-full justify-start text-left font-normal">
									<CalendarIcon class="mr-2 h-4 w-4" />
									{format(startDatum, 'dd.MM.yyyy', { locale: de })}
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-auto p-0">
								<Calendar type="single" bind:startDatum />
							</PopoverContent>
						</Popover>
					</div>
					<div class="space-y-2">
						<Label for="startzeit">Start Zeit</Label>
						<Input id="startzeit" type="time" bind:value={startZeit} required />
					</div>
				</div>

				<!-- Ende Datum und Zeit -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label>Ende Datum</Label>
						<Popover>
							<PopoverTrigger>
								<Button variant="outline" class="w-full justify-start text-left font-normal">
									<CalendarIcon class="mr-2 h-4 w-4" />
									{format(endeDatum, 'dd.MM.yyyy', { locale: de })}
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-auto p-0">
								<Calendar bind:value={endeDatum} />
							</PopoverContent>
						</Popover>
					</div>
					<div class="space-y-2">
						<Label for="endezeit">Ende Zeit</Label>
						<Input id="endezeit" type="time" bind:value={endeZeit} required />
					</div>
				</div>

				<!-- Bewerbungs Deadline -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<Label>Bewerbungs Deadline</Label>
						<Popover>
							<PopoverTrigger>
								<Button variant="outline" class="w-full justify-start text-left font-normal">
									<CalendarIcon class="mr-2 h-4 w-4" />
									{format(bewerbungsDeadline, 'dd.MM.yyyy', { locale: de })}
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-auto p-0">
								<Calendar bind:value={bewerbungsDeadline} />
							</PopoverContent>
						</Popover>
					</div>
					<div class="space-y-2">
						<Label for="bewerbungszeit">Deadline Zeit</Label>
						<Input id="bewerbungszeit" type="time" bind:value={bewerbungsZeit} required />
					</div>
				</div>

				<!-- Ort Informationen -->
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="ortstrasse">Straße & Hausnummer</Label>
						<Input
							id="ortstrasse"
							bind:value={ortStrasse}
							placeholder="z.B. Musterstraße 123"
							required
						/>
					</div>
					<div class="space-y-2">
						<Label for="ortplzstadt">PLZ & Stadt</Label>
						<Input
							id="ortplzstadt"
							bind:value={ortPlzStadt}
							placeholder="z.B. 12345 Musterstadt"
							required
						/>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="flex justify-end space-x-4">
					<Button type="button" variant="outline">Abbrechen</Button>
					<Button type="submit">Event erstellen</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
