<script lang="ts">
	import EventMasterSheet from '$lib/components/pages/events/master/EventMasterSheet.svelte';
	import EventMasterList from '$lib/components/pages/events/master/EventMasterList.svelte';
	import type { PageServerData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventMasterSchema } from '@/schemas/eventMaster';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';

	export let data: PageServerData;

	const eventFormHandler = superForm(data.form, {
		validators: zodClient(eventMasterSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'event_master_form' });
		},
		onResult: ({ result }) => {
			handleActionResultSonners(result, 'event_master_form');
			if (result.type === 'success') {
				showSheet = false;
			}
		}
	});

	const { form, enhance } = eventFormHandler;

	let showSheet = false;

	function onEdit(id: string) {
		const current = data.data.find((eventMaster) => eventMaster.id === id);
		if (current) {
			eventFormHandler.form.set({
				id: current.id,
				master_name: current.master_name,
				beschreibung: current.beschreibung
			});
			showSheet = true;
		}
	}

	function onAddNew() {
		eventFormHandler.form.set({ id: '', master_name: '', beschreibung: '' });
		showSheet = true;
	}
</script>

{#await data}
	<PageLoadSkeleton />
{:then data}
	<div class="container mx-auto p-4">
		<EventMasterList events={data.data} {onAddNew} {onEdit} />
		{#if showSheet}
			<EventMasterSheet bind:open={showSheet} {form} {enhance} />
		{/if}
	</div>
{/await}
