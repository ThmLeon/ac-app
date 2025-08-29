<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import NewEventForm from '@/components/pages/events/newEvent/newEventForm.svelte';
	import type { PageServerData } from './$types';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newEventSchema } from '@/schemas/newEventSchema';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { goto } from '$app/navigation';

	export let data: PageServerData;
	const form = superForm(data.form, {
		validators: zodClient(newEventSchema),
		dataType: 'json',
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'new_event_form' });
		},
		onResult: async ({ result }) => {
			handleActionResultSonners(result, 'new_event_form');
			if (result.status != 500 && result.type === 'success') {
				await goto(`../events`, { replaceState: true });
			}
		}
	});
</script>

<div class="container mx-auto py-8 px-4 max-w-2xl">
	<Card>
		<CardHeader>
			<CardTitle class="text-2xl font-bold">Neues Event erstellen</CardTitle>
		</CardHeader>
		<CardContent class="space-y-6">
			<NewEventForm {form} eventMasters={data.data} />
		</CardContent>
	</Card>
</div>
