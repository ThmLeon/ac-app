<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';

	// Dummy data for now; replace with real data loading later
	export let name: string = 'Max Mustermann';
	export let tags: string[] = ['Aktives Mitglied', 'Vorstand'];
	export let imageUrl: string | undefined = undefined;
	const initials = name
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
</script>

<Card class="p-6">
	<CardContent class="p-0">
		<div class="flex flex-col sm:flex-row sm:items-start gap-6">
			<Avatar class="h-28 w-28 rounded-xl">
				<AvatarImage src={imageUrl} alt={name} class="object-cover" />
				<AvatarFallback class="rounded-xl text-xl">{initials}</AvatarFallback>
			</Avatar>

			<div class="flex-1">
				<h1 class="text-3xl font-semibold leading-tight">{name}</h1>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each tags as tag}
						<Badge>{tag}</Badge>
					{/each}
				</div>
			</div>
		</div>
	</CardContent>
</Card>
