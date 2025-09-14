import { getAllEventsPaginated } from '@/client/supabase/event';
import { getRollen, getRollenMitglieder } from '@/client/supabase/mitglieder';
import type { Database } from '@/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { untrack } from 'svelte';

export type Rolle = {
	ID: number;
	Titel: string | null;
	VBBezug: number | null;
	VorgesetzteRolle: number | null;
	Beschreibung: string | null;
	KernTeam: boolean | null;
	Mitglieder: MitgliederRolle[];
	Children?: Rolle[];
};

export type MitgliederRolle = {
	ID: number;
	Titel: string | null;
	RollenID: number;
	MitgliedID: number;
	LeitendeFunktion: boolean | null;
};

class MitgliederRollenState {
	organisation: Rolle = $state({
		ID: -1,
		Titel: 'Academy Consult',
		VBBezug: null,
		VorgesetzteRolle: null,
		Beschreibung: null,
		KernTeam: false,
		Mitglieder: [],
		Children: []
	});
	mitgliederRollen: MitgliederRolle[] = $state([]);
	isLoading: boolean = $state(false);
	private supabase: SupabaseClient<Database>;

	constructor(supabase: SupabaseClient<Database>) {
		this.supabase = supabase;
	}

	async loadOrganisation() {
		await this.loadRollen();
		//await this.loadRollenMitglieder();
	}

	async loadRollen() {
		this.isLoading = true;
		try {
			const rollen = await getRollen(this.supabase);
			// Map raw roles to Rolle with empty Mitglieder and Children
			const byId = new Map<number, Rolle>();
			for (const r of rollen ?? []) {
				byId.set(r.ID, {
					ID: r.ID,
					Titel: r.Titel,
					VBBezug: r.VBBezug,
					VorgesetzteRolle: r.VorgesetzteRolle,
					Beschreibung: r.Beschreibung,
					KernTeam: r.KernTeam,
					Mitglieder: r.Mitglieder,
					Children: []
				});
			}
			// Build tree using VorgesetzteRolle as parent pointer
			const roots: Rolle[] = [];
			for (const node of byId.values()) {
				const parentId = node.VorgesetzteRolle;
				if (parentId != null && byId.has(parentId)) {
					byId.get(parentId)!.Children!.push(node);
				} else {
					roots.push(node);
				}
			}
			// Wrap everything under the overarching role
			this.organisation = {
				ID: -1,
				Titel: 'Academy Consult',
				VBBezug: null,
				VorgesetzteRolle: null,
				Beschreibung: null,
				KernTeam: false,
				Mitglieder: [],
				Children: roots
			};
			// Distribute Mitglieder to their Rollen after roles are ready
			this.applyMitgliederToRollen();
		} finally {
			this.isLoading = false;
		}
	}

	async loadRollenMitglieder() {
		this.isLoading = true;
		try {
			const mitgliederRollen = await getRollenMitglieder(this.supabase);
			this.mitgliederRollen = mitgliederRollen ?? [];
			// Distribute members to roles (works regardless of load order)
			this.applyMitgliederToRollen();
		} finally {
			this.isLoading = false;
		}
	}

	private applyMitgliederToRollen() {
		if (!this.organisation) return;
		// If we don't have a separate mitgliederRollen list yet, don't override
		// the Mitglieder that may already be embedded from getRollen().
		if (!this.mitgliederRollen || this.mitgliederRollen.length === 0) return;

		// Build index of all roles starting from the single root
		const index = new Map<number, Rolle>();
		const walk = (role: Rolle) => {
			index.set(role.ID, role);
			if (role.Children && role.Children.length) {
				for (const child of role.Children) walk(child);
			}
		};
		walk(this.organisation);

		// Clear current Mitglieder arrays before re-assigning
		for (const role of index.values()) {
			role.Mitglieder = [];
		}

		// Assign members to their matching role by RollenID
		for (const m of this.mitgliederRollen ?? []) {
			const role = index.get(m.RollenID);
			if (role) role.Mitglieder.push(m);
		}
	}
}

let mitgliederRollenState: MitgliederRollenState | null = null;
export function getMitgliederRollenState(supabase: SupabaseClient<Database>) {
	if (!mitgliederRollenState) {
		mitgliederRollenState = new MitgliederRollenState(supabase);
	}
	return mitgliederRollenState;
}
