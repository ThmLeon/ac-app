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
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { MessageSquare } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '@/api/supabase/database.types';

	const { supabase } = $props<{ supabase: SupabaseClient<Database> }>();

	let open = $state(false);
	let titel = $state('');
	let kategorie = $state('');
	let beschreibung = $state('');
	let prioritaet = $state('');
	let sending = $state(false);

	const kategorien = ['Bug', 'Feature Request', 'Sonstiges'];

	const appSeite = $derived($page.url.pathname);
	const canSend = $derived(
		titel.trim().length > 0 &&
			kategorie.trim().length > 0 &&
			prioritaet.trim().length > 0 &&
			beschreibung.trim().length > 0
	);

	async function sendFeedback() {
		if (!canSend) {
			toast.error('Bitte alle Felder ausfüllen');
			return;
		}
		if (sending) return;
		sending = true;
		toast.loading('Feedback wird gesendet', { id: 'send_feedback' });
		const { error } = await supabase.from('0_UserFeedback').insert({
			Titel: titel.trim(),
			Kategorie: kategorie.trim(),
			Prioritaet: prioritaet.trim(),
			AppSeite: appSeite,
			Beschreibung: beschreibung.trim()
		});
		if (error) {
			toast.error('Feedback konnte nicht gesendet werden', { id: 'send_feedback' });
		} else {
			toast.success('Feedback erfolgreich gesendet', { id: 'send_feedback' });
			open = false;
			titel = '';
			kategorie = '';
			prioritaet = '';
			beschreibung = '';
		}
		sending = false;
	}
</script>

<Dialog bind:open>
	<DialogTrigger>
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
			<Input placeholder="Titel" bind:value={titel} required />
			<Select type="single" bind:value={kategorie}>
				<SelectTrigger aria-required="true">{kategorie || 'Kategorie wählen'}</SelectTrigger>
				<SelectContent>
					{#each kategorien as k}
						<SelectItem value={k}>{k}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			<Select type="single" bind:value={prioritaet}>
				<SelectTrigger aria-required="true">{prioritaet || 'Priorität wählen'}</SelectTrigger>
				<SelectContent>
					<SelectItem value="Niedrig">Niedrig</SelectItem>
					<SelectItem value="Mittel">Mittel</SelectItem>
					<SelectItem value="Hoch">Hoch</SelectItem>
				</SelectContent>
			</Select>
			<Input value={appSeite} readonly />
			<Textarea rows={4} placeholder="Beschreibung" bind:value={beschreibung} required />
		</div>
		<DialogFooter>
			<Button type="button" variant="outline" onclick={() => (open = false)} disabled={sending}
				>Abbrechen</Button
			>
			<Button type="button" onclick={sendFeedback} disabled={!canSend || sending}>Senden</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

<style>
	/* No additional styles */
</style>
