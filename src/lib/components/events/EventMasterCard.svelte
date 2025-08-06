<script lang="ts">
	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import type { EventMaster } from '../pages/events/master/EventMasterList.svelte';
	import CardContent from '../ui/card/card-content.svelte';

	export let eventMaster: EventMaster;
	export let onEdit: (id: EventMaster['id']) => void; // Callback for edit action

	const eventArtColors = {
		Netzwerk: 'bg-blue-200 text-blue-800',
		Social: 'bg-green-200 text-green-800',
		Kuratoren: 'bg-purple-200 text-purple-800',
		HSM: 'bg-red-200 text-red-800',
		Sonstiges: 'bg-gray-200 text-gray-800'
	};
</script>

<Card class="w-full" style="width: 350px;">
	<CardHeader>
		<CardTitle>{eventMaster.Titel}</CardTitle>
		<Badge class={eventArtColors[eventMaster.Eventart || 'Sonstiges']}>
			{eventMaster.Eventart || 'Sonstiges'}
		</Badge>
	</CardHeader>
	<CardContent>
		{eventMaster.MasterBeschreibung}
	</CardContent>
	<CardFooter class="mt-auto flex justify-end pb-4">
		<Button variant="outline" onclick={() => onEdit(eventMaster.id)}>Bearbeiten</Button>
	</CardFooter>
</Card>
