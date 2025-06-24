<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	// Props for the event master
	export let id: string; // Unique identifier for the event master
	export let name: string;
	export let description: string;
	export let width: string = '100%'; // Default to 100% if not specified
	export let onEdit: (id: string) => void; // Callback for edit action
</script>

<Card class="w-full" style="width: {width};">
	<CardHeader>
		<CardTitle>{name}</CardTitle>
		<CardDescription>{description}</CardDescription>
	</CardHeader>

	<!-- Füllt den Raum zwischen Header und Footer -->
	<div class="flex-1"></div>

	<CardFooter class="mt-auto flex justify-end pb-4">
		<Button variant="outline" onclick={() => onEdit(id)}>Bearbeiten</Button>
	</CardFooter>
</Card>
