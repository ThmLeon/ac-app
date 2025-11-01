<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import type { SchulungMaster } from '$lib/data/mockSchulungenMasters';
	import teamsLogo from '$lib/assets/microsoft-teams.png?url';
	import { getSchulungMasterContext } from '$lib/context/schulungMasterContext';

	const { master } = getSchulungMasterContext();

	const typeBadgeClasses: Record<SchulungMaster['type'], string> = {
		Basisschulung: 'bg-blue-100 text-blue-800',
		Wahlschulung: 'bg-purple-100 text-purple-800'
	};
</script>

{#if $master}
	<Card class="w-full">
		<CardHeader class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<div class="w-full">
				<div class="flex flex-wrap items-center gap-2">
					<CardTitle>{$master.name}</CardTitle>
					<Badge class={typeBadgeClasses[$master.type]}>{$master.type}</Badge>
				</div>
				<CardDescription class="mt-2 text-base text-foreground">
					{$master.description}
				</CardDescription>
			</div>
			<Button
				href={$master.teamsWorkspaceUrl}
				variant="secondary"
				class="inline-flex items-center justify-center"
				target="_blank"
				rel="noopener noreferrer"
				title="Teams Workspace öffnen"
				aria-label="Teams Workspace öffnen"
			>
				<img src={teamsLogo} alt="" class="h-6 w-6 object-contain" />
				Teams Workspace öffnen
			</Button>
		</CardHeader>
		<CardContent class="w-full">
			<p class="text-sm text-muted-foreground">
				Alle aktuellen Informationen und Materialien findest du im zugehörigen Teams Workspace.
			</p>
		</CardContent>
	</Card>
{/if}
