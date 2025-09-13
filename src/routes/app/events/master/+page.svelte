<script lang="ts">
	import EventMasterSheet from '$lib/components/pages/events/master/EventMasterSheet.svelte';
	import EventMasterList from '$lib/components/pages/events/master/EventMasterList.svelte';
	import type { PageServerData } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { eventMasterSchema } from '@/schemas/eventMasterSchema';
	import { onMount } from 'svelte';
	import { isVorstand } from '@/utils/rollen.utils';

	let { data } = $props();

	let sheetStatus: 'new' | 'edit' | 'hidden' = $state('hidden');
	const form = superForm(data.form, {
		validators: zodClient(eventMasterSchema),
		onSubmit: () => {
			toast.loading('Eingabe wird verarbeitet', { id: 'event_master_form' });
		},
		onResult: ({ result }) => {
			handleActionResultSonners(result, 'event_master_form');
			if (result.type != 'failure' && result.status != 500) {
				sheetStatus = 'hidden';
			}
		}
	});
	const { form: formData } = form;
	let canEdit = data.isAdmin || isVorstand(data.roles);
	let canCreate = data.isAdmin || isVorstand(data.roles);
	let canDelete = data.isAdmin || isVorstand(data.roles);

	function onEdit(id: number) {
		const current = data.data.find((eventMaster: { ID: number }) => eventMaster.ID === id);
		if (current) {
			formData.set({
				ID: current.ID,
				Titel: current.Titel!,
				MasterBeschreibung: current.MasterBeschreibung!,
				Eventart: current.Eventart!
			});
			sheetStatus = 'edit';
		}
	}

	function onAddNew() {
		formData.set({ ID: 0, Titel: '', MasterBeschreibung: '', Eventart: 'Sonstiges' });
		sheetStatus = 'new';
	}
</script>

{#await data}
	<PageLoadSkeleton />
{:then data}
	<div class="container mx-auto p-4">
		<EventMasterList
			eventMasters={data.data}
			{onAddNew}
			{onEdit}
			{canCreate}
			{canEdit}
			{canDelete}
		/>
		<EventMasterSheet bind:sheetStatus {form} {canDelete} {canEdit} />
	</div>
{/await}
