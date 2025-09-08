<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import JSZip from 'jszip';
	// If you have a ScrollArea component you can import it; otherwise remove related markup.
	// import { ScrollArea } from '@/components/ui/scroll-area';
	import { saveAs } from 'file-saver';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '@/database.types';

	type EventApplication = {
		ID: number;
		Titel: string | null;
		Besetzt: boolean | null;
		Anwesend: boolean | null;
		BewerbungText: string | null;
		Essgewohnheiten: string | null;
	};

	const { supabase, applications, eventId } = $props<{
		supabase: SupabaseClient<Database>;
		applications: EventApplication[];
		eventId: number;
	}>();

	async function showAnlage(app: EventApplication) {
		toast.loading('Anlage wird vorbereitet', { id: 'download_application_' + app.ID });
		const anhang = await supabase?.storage
			.from('events')
			.createSignedUrl(`bewerbungenAnhang/${eventId}/${app.ID}.pdf`, 60 * 60);
		if (anhang?.error || !anhang?.data) {
			toast.error('Bewerber hat keine Anlage hochgeladen', {
				id: 'download_application_' + app.ID
			});
		} else {
			toast.success('Anlage wird angezeigt', { id: 'download_application_' + app.ID });
			window.open(anhang.data?.signedUrl, '_blank');
		}
	}

	async function handleDownloadAll() {
		toast.loading('Anlagen werden vorbereitet', { id: 'download_all_applications' });
		const anhaenge = await supabase?.storage.from('events').list(`bewerbungenAnhang/${eventId}`);
		if (anhaenge?.error || !anhaenge?.data) {
			toast.error('Fehler beim Laden der Anlagen', { id: 'download_all_applications' });
		} else {
			const zip = new JSZip();
			for (const [i, file] of anhaenge.data.entries()) {
				const { data: fileData, error: fileError } =
					(await supabase?.storage
						.from('events')
						.download(`bewerbungenAnhang/${eventId}/${file.name}`)) || {};
				if (fileData) {
					const ext = file.name.split('.').pop();
					// get the name part before the .
					let name = file.name.split('.').slice(0, -1).join('.');
					for (const app of applications) {
						if (name === app.ID.toString()) {
							name = app.Titel || name;
							break;
						}
					}
					zip.file(`${name}.${ext}`, fileData);
				}
			}
			const content = await zip.generateAsync({ type: 'blob' });
			saveAs(content, `bewerbungen_${eventId}.zip`);
			toast.success('Alle Anlagen wurden heruntergeladen', { id: 'download_all_applications' });
		}
	}
</script>

<div class="grid gap-4 w-full">
	<slot name="header">
		<div class="flex items-center justify-between gap-4">
			<h2 class="text-lg font-semibold tracking-tight">Bewerbungen</h2>
			<Button
				variant="outline"
				size="sm"
				type="button"
				disabled={!applications.length}
				onclick={handleDownloadAll}
			>
				Alle Anlagen herunterladen
			</Button>
		</div>
	</slot>

	{#if applications.length === 0}
		<div class="text-sm text-muted-foreground">Keine Bewerbungen vorhanden.</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-3 items-stretch">
			{#each applications as app (app.ID)}
				<Card class="flex flex-col h-full">
					<CardHeader class="pb-3">
						<CardTitle class="text-base">
							{app.Titel || 'Unbekannter Bewerber'}
						</CardTitle>
					</CardHeader>
					<CardContent class="flex flex-col gap-3 text-sm flex-1">
						<div>
							<div class="font-medium">Bewerbung</div>
							<p class="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
								{app.BewerbungText || '-'}
							</p>
						</div>
						<div>
							<div class="font-medium">Essgewohnheiten</div>
							<p class="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
								{app.Essgewohnheiten || '-'}
							</p>
						</div>
						<div class="mt-auto pt-2">
							<Button variant="outline" size="sm" type="button" onclick={() => showAnlage(app)}>
								Anlage anzeigen
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{/if}
</div>
