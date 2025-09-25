<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import Button from '@/components/ui/button/button.svelte';
	import type { RoleFilter } from '@/state/MitgliederRollen.svelte';
	import { Undo } from 'lucide-svelte';

	let { filter = $bindable(), onNew }: { filter: RoleFilter; onNew: () => void } = $props();
</script>

<!-- Filter bar: button left, filters right -->
<div class="mb-3 flex flex-wrap items-end gap-3">
	<!-- Left: Neue Rolle -->
	<div>
		<button class={buttonVariants({ variant: 'default' })} onclick={onNew}>Neue Rolle</button>
	</div>

	<!-- Right: filters -->
	<div class="ml-auto flex flex-wrap items-end gap-3">
		<Button
			onclick={() =>
				(filter = { name: '', vb: 'all', kernteam: 'all', aktiv: 'all', showOrgChartOnly: 'all' })}
			variant="outline"
			size="sm"
		>
			<Undo />
		</Button>
		<!-- Rollenname -->
		<div class="space-y-1">
			<Label for="filter-rollenname">Rollenname</Label>
			<Input
				id="filter-rollenname"
				class="h-8 w-56"
				placeholder="Suchen…"
				bind:value={filter.name}
			/>
		</div>
		<!-- VB -->
		<div class="space-y-1">
			<Label for="filter-vb">VB</Label>
			<Select type="single" bind:value={filter.vb}>
				<SelectTrigger id="filter-vb" size="sm" class="w-40"
					>{filter.vb === 'all'
						? 'Alle'
						: filter.vb.charAt(0).toUpperCase() + filter.vb.slice(1)}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="F&R">F&R</SelectItem>
					<SelectItem value="TPM">TPM</SelectItem>
					<SelectItem value="KB">KB</SelectItem>
					<SelectItem value="MPR">MPR</SelectItem>
					<SelectItem value="Internes">Internes</SelectItem>
					<SelectItem value="sonstige">Sonstige</SelectItem>
				</SelectContent>
			</Select>
		</div>
		<!-- Kernteam -->
		<div class="space-y-1">
			<Label for="filter-kernteam">Kernteam</Label>
			<Select type="single" bind:value={filter.kernteam}>
				<SelectTrigger id="filter-kernteam" size="sm" class="w-32"
					>{filter.kernteam === 'all'
						? 'Alle'
						: filter.kernteam.charAt(0).toUpperCase() + filter.kernteam.slice(1)}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="ja">Ja</SelectItem>
					<SelectItem value="nein">Nein</SelectItem>
				</SelectContent>
			</Select>
		</div>
		<!-- Aktive Rolle -->
		<div class="space-y-1">
			<Label for="filter-aktiv">Aktive Rolle</Label>
			<Select type="single" bind:value={filter.aktiv}>
				<SelectTrigger id="filter-aktiv" size="sm" class="w-32"
					>{filter.aktiv === 'all'
						? 'Alle'
						: filter.aktiv.charAt(0).toUpperCase() + filter.aktiv.slice(1)}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="ja">Ja</SelectItem>
					<SelectItem value="nein">Nein</SelectItem>
				</SelectContent>
			</Select>
		</div>
		<!-- Im Org. Chart Anzeigen -->
		<div class="space-y-1">
			<Label for="filter-chart">In Org. Chart Anzeigen</Label>
			<Select type="single" bind:value={filter.showOrgChartOnly}>
				<SelectTrigger id="filter-chart" size="sm" class="w-40"
					>{filter.showOrgChartOnly === 'all'
						? 'Alle'
						: filter.showOrgChartOnly.charAt(0).toUpperCase() +
							filter.showOrgChartOnly.slice(1)}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="ja">Ja</SelectItem>
					<SelectItem value="nein">Nein</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
</div>
