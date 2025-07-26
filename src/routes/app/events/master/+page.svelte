<script lang="ts">
	import EventMasterSheet from '$lib/components/pages/events/master/EventMasterSheet.svelte';
	import EventMasterList from '$lib/components/pages/events/master/EventMasterList.svelte';
	import type { PageServerData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	//import { eventMasterSchema } from '@/formSchemas/eventMaster';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { eventMasterSchema } from '@/schemas/eventMaster';

	export let data: PageServerData;
	let showSheet = false;
	const { form, enhance, errors } = superForm(data.form, {
		validators: zodClient(eventMasterSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'event_master_form' });
		},
		onResult: ({ result }) => {
			handleActionResultSonners(result, 'event_master_form');
			if (result.type === 'failure' && result.status === 500) {
				showSheet = false;
			}
		}
	});

	function onEdit(id: string) {
		const current = data.data.find((eventMaster) => eventMaster.id === id);
		if (current) {
			form.set({
				id: current.id,
				master_name: current.master_name,
				beschreibung: current.beschreibung
			});
			showSheet = true;
		}
	}

	function onAddNew() {
		form.set({ id: '', master_name: '', beschreibung: '' });
		showSheet = true;
	}
</script>

{#await data}
	<PageLoadSkeleton />
{:then data}
	<div class="container mx-auto p-4">
		<EventMasterList events={data.data} {onAddNew} {onEdit} />
		{#if showSheet}
			<EventMasterSheet bind:open={showSheet} {form} {enhance} {errors} />
		{/if}
	</div>
{/await}
