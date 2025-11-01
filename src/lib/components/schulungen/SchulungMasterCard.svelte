<script lang="ts">
	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { SchulungMaster } from '$lib/data/mockSchulungenMasters';

	export let schulungMaster: SchulungMaster;

	const typeBadgeClasses: Record<SchulungMaster['type'], string> = {
		Basisschulung: 'bg-blue-100 text-blue-800',
		Wahlschulung: 'bg-purple-100 text-purple-800'
	};

	const instancesLabel = `${schulungMaster.instances.length} Instanzen`;
</script>

<Card class="w-full" style="width: 350px;">
	<CardHeader class="gap-2">
		<div class="flex items-start justify-between gap-2">
			<CardTitle>{schulungMaster.name}</CardTitle>
			<Badge class={typeBadgeClasses[schulungMaster.type]}>{schulungMaster.type}</Badge>
		</div>
		<CardDescription>{instancesLabel}</CardDescription>
	</CardHeader>
	<CardContent>
		{schulungMaster.description}
	</CardContent>
	<CardFooter class="mt-auto flex justify-end pb-4">
		<Button variant="outline" href={`/app/schulungen/master/${schulungMaster.id}`}>
			Details
		</Button>
	</CardFooter>
</Card>
