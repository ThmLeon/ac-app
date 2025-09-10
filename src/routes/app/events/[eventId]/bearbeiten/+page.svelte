<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import NewEventForm from '@/components/pages/events/newEvent/newEventForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newEventSchema } from '@/schemas/newEventSchema';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const form = superForm(data.form, {
		validators: zodClient(newEventSchema),
		dataType: 'json',
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'edit_event_form' });
		},
		onResult: async ({ result }) => {
			handleActionResultSonners(result, 'edit_event_form');
			if (result.status != 500 && result.type === 'success') {
				await goto('../', { replaceState: true });
			}
		}
	});
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<Card>
		<CardHeader>
			<CardTitle class="text-2xl font-bold">Event bearbeiten</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<NewEventForm
				{form}
				eventMasters={data.eventMasters}
				supabase={data.supabase}
				formAction="?/updateEvent"
				eventVerantwortliche={data.eventData.event_verantwortliche.map((ev) => ({
					ID: ev.MitgliedID || -1,
					Titel: ev.Titel || '',
					Art: ev.mitglieder?.Art || 'Aktiv',
					Rolle: ev.mitglieder?.Rolle || 'Mitglied'
				}))}
			/>
		</CardContent>
	</Card>
</div>
