<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { RoleFilter, Rolle } from '@/state/MitgliederRollen.svelte';
	import { rollenIDToVB } from '@/utils/utils';

	export let roles: Rolle[] = [];
	export let onDetails: (role: Rolle) => void = () => {};
	export let roleFilter: RoleFilter = {
		name: '',
		vb: 'all',
		kernteam: 'all',
		aktiv: 'all',
		showOrgChartOnly: 'all'
	};

	function returnFilteredRoles(roles: Rolle[]) {
		console.log('Current Role Filter:', roleFilter); // Debugging line
		let filteredRoles: Rolle[] = roles;
		if (roleFilter.name != '') {
			filteredRoles = filteredRoles.filter((role) => {
				return role.Titel?.toLocaleLowerCase().includes(roleFilter.name.toLowerCase());
			});
		}
		if (roleFilter.vb != 'all') {
			if (roleFilter.vb === 'sonstige') {
				filteredRoles = filteredRoles.filter((role) => {
					return role.VBBezug == 16;
				});
			} else {
				filteredRoles = filteredRoles.filter((role) => {
					return rollenIDToVB(role.VBBezug, true) === roleFilter.vb;
				});
			}
		}
		if (roleFilter.kernteam != 'all') {
			filteredRoles = filteredRoles.filter((role) => {
				return roleFilter.kernteam === 'ja' ? role.KernTeam === true : role.KernTeam === false;
			});
		}
		if (roleFilter.aktiv != 'all') {
			filteredRoles = filteredRoles.filter((role) => {
				return roleFilter.aktiv === 'ja' ? role.RolleAktiv === true : role.RolleAktiv === false;
			});
		}
		if (roleFilter.showOrgChartOnly != 'all') {
			filteredRoles = filteredRoles.filter((role) => {
				return roleFilter.showOrgChartOnly === 'ja'
					? role.OrgChartZeigen === true
					: role.OrgChartZeigen === false;
			});
		}
		return filteredRoles;
	}
</script>

{#if returnFilteredRoles(roles).length === 0}
	<div class="p-4 text-center text-sm text-muted-foreground mb-50">Keine Rollen gefunden</div>
{:else}
	<ul class="rounded-md border divide-y">
		{#each returnFilteredRoles(roles) as role}
			<li
				class="flex items-center justify-between gap-4 p-3 hover:bg-accent/50 transition-colors"
				class:opacity-50={!role.RolleAktiv}
			>
				<div class="min-w-0">
					<p class="truncate font-medium">{role.Titel}</p>
					<div class="flex items-center gap-2">
						<Badge variant="outline">{role.Mitglieder.length} Mitglieder</Badge>
						{#if role.VBBezug && !['N/A', 'Sonstige'].includes(rollenIDToVB(role.VBBezug, true))}
							<Badge variant="outline">{rollenIDToVB(role.VBBezug, true)}</Badge>
						{/if}
						{#if role.KernTeam}
							<Badge variant="secondary">Kernteam</Badge>
						{/if}
						{#if role.OrgChartZeigen}
							<Badge variant="secondary">In Org Chart</Badge>
						{/if}
					</div>
				</div>
				<div class="flex items-center gap-2">
					<button
						class={buttonVariants({ variant: 'outline', size: 'sm' })}
						onclick={() => onDetails(role)}
					>
						Details
					</button>
				</div>
			</li>
		{/each}
	</ul>
{/if}
