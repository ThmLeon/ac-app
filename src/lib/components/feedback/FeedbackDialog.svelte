<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { MessageSquare } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '@/database.types';

	const { supabase } = $props<{ supabase: SupabaseClient<Database> }>();

	let open = $state(false);
	let titel = $state('');
	let kategorie = $state('');
	let beschreibung = $state('');

	const kategorien = ['Bug', 'Feature Request', 'Verbesserung', 'Sonstiges'];

	$: appSeite = $page.url.pathname;

	async function sendFeedback() {
		toast.loading('Feedback wird gesendet', { id: 'send_feedback' });
		const { error } = await supabase.from('Feedback').insert({
			Titel: titel,
			Kategorie: kategorie,
			AppSeite: appSeite,
			Beschreibung: beschreibung
		});
		if (error) {
			toast.error('Feedback konnte nicht gesendet werden', { id: 'send_feedback' });
		} else {
			toast.success('Feedback erfolgreich gesendet', { id: 'send_feedback' });
			open = false;
			titel = '';
			kategorie = '';
			beschreibung = '';
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger asChild>
		<Button class="fixed bottom-4 right-4 rounded-full h-12 w-12" variant="default" size="icon">
			<MessageSquare class="h-5 w-5" />
			<span class="sr-only">Feedback</span>
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Feedback geben</DialogTitle>
			<DialogDescription>Teile uns dein Feedback zur aktuellen Seite mit.</DialogDescription>
		</DialogHeader>
		<div class="grid gap-4 py-4">
			<Input placeholder="Titel" bind:value={titel} />
			<Select bind:value={kategorie}>
				<SelectTrigger>
					<SelectValue placeholder="Kategorie" />
				</SelectTrigger>
				<SelectContent>
					{#each kategorien as k}
						<SelectItem value={k}>{k}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			<Input value={appSeite} readonly />
			<Textarea rows="4" placeholder="Beschreibung" bind:value={beschreibung} />
		</div>
		<DialogFooter>
			<Button type="button" variant="outline" on:click={() => (open = false)}>Abbrechen</Button>
			<Button type="button" on:click={sendFeedback}>Senden</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

<style>
	/* No additional styles */
</style>
