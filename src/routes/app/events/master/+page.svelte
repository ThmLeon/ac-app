<script lang="ts">
	import EventMasterSheet from '$lib/components/pages/events/master/EventMasterSheet.svelte';
	import EventMasterList from '$lib/components/pages/events/master/EventMasterList.svelte';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { eventMasterSchema, type EventMasterForm } from '@/schemas/eventMasterSchema';
	import { isVorstand } from '@/utils/rollen.utils';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import type { SuperFormData } from 'sveltekit-superforms/client';

	let { data } = $props();
	const queries = eventsQueries(data.supabase, useQueryClient());
	const eventMasters = queries.masters.listAll();
	const masterUpdate = queries.masters.update();
	const masterDelete = queries.masters.delete();

	let sheetStatus: 'new' | 'edit' | 'hidden' = $state('hidden');

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(eventMasterSchema),
		onUpdate: async ({ form }) => {
			if (form.valid) {
				console.log('form', form.data);
				switch (form.data.Action) {
					case 'update':
						$masterUpdate.mutate(form);
						break;
					case 'delete':
						console.log('delete', form.data.ID);
						$masterDelete.mutate(form.data.ID);
						break;
				}
				sheetStatus = 'hidden';
			}
		}
	});
	let formData: SuperFormData<EventMasterForm> = form.form;

	let canEdit = data.isAdmin || isVorstand(data.roles);
	let canCreate = data.isAdmin || isVorstand(data.roles);
	let canDelete = data.isAdmin || isVorstand(data.roles);

	function prepareForm(id: number, action: 'edit' | 'new') {
		const current = $eventMasters.data!.find(
			(eventMaster: { ID: number }) => eventMaster.ID === id
		);
		if (current) {
			formData.set({
				ID: current.ID,
				Titel: current.Titel!,
				MasterBeschreibung: current.MasterBeschreibung!,
				Eventart: current.Eventart!,
				Action: 'update'
			});
			sheetStatus = 'edit';
		}
		sheetStatus = 'edit';
	}

	function onAddNew() {
		/*formData.set({ ID: 0, Titel: '', MasterBeschreibung: '', Eventart: 'Sonstiges' });
		sheetStatus = 'new';*/
		sheetStatus = 'new';
	}
</script>

{#if !$eventMasters.data}
	<PageLoadSkeleton />
{:else}
	<div class="container mx-auto p-4">
		<EventMasterList
			eventMasters={$eventMasters.data}
			{prepareForm}
			{canCreate}
			{canEdit}
			{canDelete}
		/>
		<EventMasterSheet bind:sheetStatus {form} {canDelete} {canEdit} />
	</div>
{/if}
