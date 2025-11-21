<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import NewEventForm from '@/components/pages/events/newEvent/newEventForm.svelte';
	import type { PageServerData } from './$types';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newEventSchema } from '@/schemas/newEventSchema';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const eventMasters = queries.masters.listAll();
	const newEventMutation = queries.add();

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(newEventSchema),
		dataType: 'json',
		onUpdate: async ({ form }) => {
			if (form.valid) {
				$newEventMutation.mutate(form);
			}
		}
	});

	$effect(() => {
		if ($newEventMutation.isSuccess) {
			goto('/app/events');
		}
	});
</script>

{#if !$eventMasters.data}
	<PageLoadSkeleton />
{:else}
	<div class="container mx-auto py-8 px-4 max-w-2xl">
		<Card>
			<CardHeader>
				<CardTitle class="text-2xl font-bold">Neues Event erstellen</CardTitle>
			</CardHeader>
			<CardContent class="space-y-6">
				<NewEventForm {form} eventMasters={$eventMasters.data} supabase={data.supabase} />
			</CardContent>
		</Card>
	</div>
{/if}
