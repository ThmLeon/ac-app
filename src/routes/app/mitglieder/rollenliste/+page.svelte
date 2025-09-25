<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import OrgChart from '$lib/components/pages/mitglieder/rollenliste/OrgChart.svelte';
	import {
		getMitgliederRollenState,
		type RoleFilter,
		type Rolle,
		type VB
	} from '@/state/MitgliederRollen.svelte';
	import { onMount } from 'svelte';

	import RoleFilterBar from '$lib/components/pages/mitglieder/rollenliste/RoleFilterBar.svelte';
	import RoleList from '$lib/components/pages/mitglieder/rollenliste/RoleList.svelte';
	import RoleFormSheet from '$lib/components/pages/mitglieder/rollenliste/RoleFormSheet.svelte';
	import { rollenIDToVB } from '@/utils/utils.js';

	const { data } = $props();
	const mitgliederRollenState = $derived(getMitgliederRollenState(data.supabase));

	onMount(async () => {
		await mitgliederRollenState.loadRollen();
	});
	let roleFilter: RoleFilter = $state({
		name: '',
		vb: 'all',
		kernteam: 'all',
		aktiv: 'all',
		showOrgChartOnly: 'all'
	});
	// Sheet + form state (dummy)
	let sheetOpen = $state(false);
	let editingRole: Rolle | null = $state(null);

	let form = $state({
		rollenname: '',
		vb: 'TPM' as VB,
		vorgesetzteRolleId: '' as string,
		beschreibung: '',
		bewerbungOffen: false,
		kernteam: false,
		rolleAktiviert: true,
		anzeigenImChart: true
	});

	function openForNew() {
		editingRole = null;
		form = {
			rollenname: '',
			vb: 'TPM' as VB,
			vorgesetzteRolleId: '',
			beschreibung: '',
			bewerbungOffen: false,
			kernteam: false,
			rolleAktiviert: true,
			anzeigenImChart: true
		};
		sheetOpen = true;
	}

	function openForEdit(role: Rolle) {
		editingRole = role;
		form = {
			rollenname: role.Titel ?? '',
			vb: rollenIDToVB(role.VBBezug, false) as VB,
			vorgesetzteRolleId: '',
			beschreibung: '',
			bewerbungOffen: false,
			kernteam: role.KernTeam ?? false,
			rolleAktiviert: role.RolleAktiv ?? false,
			anzeigenImChart: true
		};
		sheetOpen = true;
	}
</script>

<section class="p-6 space-y-4">
	<h1 class="text-2xl font-semibold">Rollenliste (Org Chart)</h1>
	<div class="h-[70vh] rounded-md border">
		<OrgChart root={mitgliederRollenState.organisationTree} />
	</div>

	<!-- Roles list below the org chart -->
	<div class="mt-6">
		<div class="mb-2 flex items-center justify-between gap-3">
			<h2 class="text-xl font-semibold">Alle Rollen</h2>
		</div>

		<RoleFilterBar onNew={openForNew} bind:filter={roleFilter} />
		<RoleList roles={mitgliederRollenState.rollen} onDetails={openForEdit} {roleFilter} />
	</div>

	<RoleFormSheet
		bind:open={sheetOpen}
		bind:form
		bind:editingRole
		rolesForParent={mitgliederRollenState.rollen}
	/>
</section>
