import { getRollen, getRollenMitglieder } from '@/client/supabase/mitglieder';
import type { Database } from '@/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type VB = 'F&R' | 'TPM' | 'MPR' | 'Internes' | 'KB';

export type Rolle = Pick<
	Database['public']['Tables']['1_Rollen']['Row'],
	| 'ID'
	| 'Titel'
	| 'VBBezug'
	| 'VorgesetzteRolle'
	| 'Beschreibung'
	| 'KernTeam'
	| 'RolleAktiv'
	| 'RolleAktiv'
	| 'OrgChartZeigen'
	| 'AzureSync'
> & {
	Mitglieder: MitgliederRolle[];
	Children?: Rolle[];
};

export type MitgliederRolle = Pick<
	Database['public']['Tables']['1_RollenMitglieder']['Row'],
	'ID' | 'Titel' | 'RollenID' | 'MitgliedID' | 'LeitendeFunktion'
>;

export type RoleFilter = {
	name: string;
	vb: 'F&R' | 'TPM' | 'MPR' | 'KB' | 'Internes' | 'all' | 'sonstige';
	kernteam: 'ja' | 'nein' | 'all';
	aktiv: 'ja' | 'nein' | 'all';
	showOrgChartOnly: 'ja' | 'nein' | 'all';
};

class MitgliederRollenState {
	organisationTree: Rolle = $state({} as Rolle);
	rollen: Rolle[] = $state([]);
	isLoading: boolean = $state(false);
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>) {
		this.supabase = supabase;
		this.loadRollen();
		this.buildOrganisationTree();
	}

	async loadRollen() {
		this.isLoading = true;
		this.rollen = await getRollen(this.supabase);
		// Nach dem Laden sofort den Organisationsbaum neu aufbauen
		await this.buildOrganisationTree();
		this.isLoading = false;
	}

	async buildOrganisationTree() {
		this.isLoading = true;
		if (!this.rollen || this.rollen.length === 0) return;

		const rollenByID = new Map<number, Rolle>();
		for (const r of this.rollen) {
			if (r.AzureSync && r.RolleAktiv && r.OrgChartZeigen) rollenByID.set(r.ID, { ...r });
		}
		const roots: Rolle[] = [];
		for (const node of rollenByID.values()) {
			const parentId = node.VorgesetzteRolle;
			if (parentId != null && rollenByID.has(parentId)) {
				rollenByID.get(parentId)!.Children!.push(node);
			} else {
				roots.push(node);
			}
		}
		this.organisationTree = {
			ID: -1,
			Titel: 'Academy Consult',
			VBBezug: null,
			VorgesetzteRolle: null,
			Beschreibung: null,
			KernTeam: false,
			RolleAktiv: true,
			OrgChartZeigen: true,
			AzureSync: true,
			Mitglieder: [],
			Children: roots
		};
		this.isLoading = false;
	}
}

let mitgliederRollenState: MitgliederRollenState | null = null;
export function getMitgliederRollenState(supabase: SupabaseClient<Database>) {
	if (!mitgliederRollenState) {
		mitgliederRollenState = new MitgliederRollenState(supabase);
	}
	return mitgliederRollenState;
}
