<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { Mitglied } from '@/state/MitgliederSearchState.svelte';
	import { mitgliederStatusAsText } from '@/utils/utils';

	export let mitglied: Mitglied;

	const initials = () => {
		if (!mitglied.Titel) return '';
		return mitglied.Titel.split(' ')
			.map((n) => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	};
</script>

<Card>
	<div class="flex items-center justify-between gap-4">
		<div class="flex items-center gap-4 min-w-0">
			<Avatar class="h-12 w-12 rounded-lg">
				<AvatarImage src={undefined} alt={mitglied.Titel} class="object-cover" />
				<AvatarFallback class="rounded-lg">{initials()}</AvatarFallback>
			</Avatar>
			<div class="min-w-0 ml-4">
				<p class="font-medium truncate">
					{mitglied.Titel}
				</p>
				<div class="mt-1 flex flex-wrap gap-2">
					<Badge variant="outline">Generation {mitglied.Generation}</Badge>
					<Badge variant="outline">{mitgliederStatusAsText(mitglied.Art!, mitglied.Rolle!)}</Badge>
				</div>
			</div>
		</div>
		<a href="/app/mitglieder/profil" class="shrink-0">
			<Button variant="outline">Profil ansehen</Button>
		</a>
	</div>
</Card>
