<script lang="ts">
	import CardBase from './CardBase.svelte';
	import { Separator } from '$lib/components/ui/separator';

	// Props to feed real data later; for now provide example defaults
	export let strasseHausnummer: string = 'Musterstraße 12';
	export let plz: string = '12345';
	export let ort: string = 'Musterstadt';

	export let telefonnummer: string = '+49 151 23456789';
	export let privateMail: string = 'max.mustermann@example.com';
	export let acMail: string = 'max.mustermann@ac-team.de';
	export let geburtsdatum: string = '1998-05-20'; // ISO for now
	export let linkedin: string = 'https://www.linkedin.com/in/max-mustermann';
</script>

<CardBase title="Kontaktdaten">
	<div class="space-y-6">
		<!-- Adresse -->
		<div class="space-y-3">
			<h3 class="text-sm font-medium text-muted-foreground">Adresse</h3>
			<div class="grid gap-2 sm:grid-cols-2 text-sm">
				<div class="sm:col-span-2">
					<div class="text-muted-foreground">Straße & Hausnummer</div>
					<div class="font-medium">{strasseHausnummer}</div>
				</div>
				<div>
					<div class="text-muted-foreground">PLZ</div>
					<div class="font-medium">{plz}</div>
				</div>
				<div>
					<div class="text-muted-foreground">Ort</div>
					<div class="font-medium">{ort}</div>
				</div>
			</div>
		</div>

		<Separator />

		<!-- Kontakt -->
		<div class="space-y-3">
			<h3 class="text-sm font-medium text-muted-foreground">Kontakt</h3>
			<div class="grid gap-2 sm:grid-cols-2 text-sm">
				<div>
					<div class="text-muted-foreground">Telefonnummer</div>
					<a
						class="font-medium text-primary hover:underline"
						href={`tel:${telefonnummer.replace(/\s+/g, '')}`}>{telefonnummer}</a
					>
				</div>
				<div>
					<div class="text-muted-foreground">Private Mail</div>
					<a class="font-medium text-primary hover:underline" href={`mailto:${privateMail}`}
						>{privateMail}</a
					>
				</div>
				<div>
					<div class="text-muted-foreground">AC-Mail</div>
					<a class="font-medium text-primary hover:underline" href={`mailto:${acMail}`}>{acMail}</a>
				</div>
				<div>
					<div class="text-muted-foreground">Geburtsdatum</div>
					<div class="font-medium">{new Date(geburtsdatum).toLocaleDateString('de-DE')}</div>
				</div>
				<div class="sm:col-span-2">
					<div class="text-muted-foreground">LinkedIn</div>
					<a
						class="font-medium text-primary break-all hover:underline"
						href={linkedin}
						target="_blank"
						rel="noreferrer noopener">{linkedin}</a
					>
				</div>
			</div>
		</div>
	</div>
</CardBase>
