<script lang="ts">
    import EventMasterSheet from '$lib/components/pages/events/master/EventMasterSheet.svelte';
    import EventMasterList from '$lib/components/pages/events/master/EventMasterList.svelte';
    import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
    import {superForm} from 'sveltekit-superforms';
    import {zodClient} from 'sveltekit-superforms/adapters';
    import {type EventMasterForm, eventMasterSchema} from '@/schemas/eventMasterSchema';
    import {eventsQueries} from '@/query/events';
    import {useQueryClient} from '@sveltestack/svelte-query';
    import type {SuperFormData} from 'sveltekit-superforms/client';
    import {getRolesContext, Roles} from "@/context/rolesContext";

    let { data } = $props();
	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const eventMasters = queries.masters.listAll();
	const masterUpdate = queries.masters.update();
	const masterDelete = queries.masters.delete();
	const masterAdd = queries.masters.add();

	const { userHasRole, userIsAppAdmin } = getRolesContext();

	let sheetStatus: 'new' | 'edit' | 'hidden' = $state('hidden');
	let formAction: 'add' | 'update' | 'delete' = $state('add');

	const form = superForm(data.form, {
		SPA: true,
		validators: zodClient(eventMasterSchema),
		onUpdate: async ({ form }) => {
			if (form.valid) {
				if (formAction === 'add') {
					$masterAdd.mutate(form);
				} else if (formAction === 'update') {
					$masterUpdate.mutate(form);
				} else if (formAction === 'delete') {
					$masterDelete.mutate(form.data.ID);
				}
				sheetStatus = 'hidden';
			}
		}
	});
	let formData: SuperFormData<EventMasterForm> = form.form;

	function prepareForm(id: number) {
		const current = $eventMasters.data!.find(
			(eventMaster: { ID: number }) => eventMaster.ID === id
		);
		if (current) {
			formData.set({
				ID: current.ID,
				Titel: current.Titel!,
				MasterBeschreibung: current.MasterBeschreibung!,
				Eventart: current.Eventart!
			});
			sheetStatus = 'edit';
		} else {
			formData.set({
				ID: 0,
				Titel: '',
				MasterBeschreibung: '',
				Eventart: 'HSM'
			});
			sheetStatus = 'new';
		}
	}

	function submitForm(_formAction: 'add' | 'update' | 'delete') {
		formAction = _formAction;
		form.submit();
	}
</script>

{#if !$eventMasters.data}
	<PageLoadSkeleton />
{:else}
	<div class="container mx-auto p-4">
		<EventMasterList
			eventMasters={$eventMasters.data}
			{prepareForm}
			canCreate={$userIsAppAdmin || userHasRole(Roles.Vorstand)}
			canEdit={$userIsAppAdmin || userHasRole(Roles.Vorstand)}
			canDelete={$userIsAppAdmin || userHasRole(Roles.Vorstand)}
		/>
		<EventMasterSheet
			bind:sheetStatus
			{form}
			canDelete={$userIsAppAdmin || userHasRole(Roles.Vorstand)}
			canEdit={$userIsAppAdmin || userHasRole(Roles.Vorstand)}
			{submitForm}
		/>
	</div>
{/if}
