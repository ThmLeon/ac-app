<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import MitgliedCard from '$lib/components/general/MitgliedCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { SchulungInstance } from '$lib/data/mockSchulungenMasters';

	export let instances: SchulungInstance[] = [];
	export let buttonLabel: string = 'Details';
	export let emptyMessage: string = 'Aktuell sind keine Schulungsinstanzen geplant.';
	export let showMasterName = false;
	export let linkToDetails = false;
	export let detailBasePath = '/app/schulungen';

	const statusLabels: Record<NonNullable<SchulungInstance['status']>, string> = {
		beworben: 'Beworben',
		besetzt: 'Besetzt',
		anwesend: 'Anwesend',
		offen: 'Offen'
	};

	const statusBadgeClasses: Record<NonNullable<SchulungInstance['status']>, string> = {
		beworben: 'bg-blue-100 text-blue-800',
		besetzt: 'bg-emerald-100 text-emerald-800',
		anwesend: 'bg-amber-100 text-amber-800',
		offen: 'bg-gray-100 text-gray-800'
	};
</script>

{#if instances.length === 0}
	<p class="text-sm text-muted-foreground">{emptyMessage}</p>
{:else}
	<div class="flex flex-col gap-4">
		{#each instances as instance (instance.id)}
			<Card class="w-full">
				<CardHeader class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
					<div class="w-full space-y-1">
						{#if showMasterName && instance.masterName}
							<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								{instance.masterName}
							</p>
						{/if}
						<div class="flex flex-wrap items-center gap-2">
							<CardTitle class="text-lg font-semibold">{instance.name}</CardTitle>
							{#if instance.status}
								<Badge class={statusBadgeClasses[instance.status]}>
									{statusLabels[instance.status]}
								</Badge>
							{/if}
						</div>
						<CardDescription>
							{instance.date}
							{#if instance.time}
								<span class="mx-1 text-muted-foreground">·</span>
								{instance.time}
							{/if}
						</CardDescription>
					</div>
					{#if linkToDetails}
						<a href={`${detailBasePath}/${instance.id}`} class="self-start">
							<Button type="button" variant="outline">
								{buttonLabel}
							</Button>
						</a>
					{:else}
						<Button type="button" variant="outline" class="self-start">
							{buttonLabel}
						</Button>
					{/if}
				</CardHeader>
				<CardContent class="w-full">
					<h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Schulungsleiter
					</h3>
					{#if instance.leaders.length === 0}
						<p class="text-sm text-muted-foreground">Noch keine Schulungsleiter zugewiesen.</p>
					{:else}
						<div class="flex flex-wrap gap-3">
							{#each instance.leaders as leader (leader.id)}
								<div class="shrink-0">
									<MitgliedCard
										name={leader.name}
										imageUrl={leader.imageUrl}
										art={leader.art}
										rolle={leader.rolle}
									/>
								</div>
							{/each}
						</div>
					{/if}
				</CardContent>
			</Card>
		{/each}
	</div>
{/if}
