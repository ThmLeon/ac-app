<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	type Member = {
		id: number;
		name: string;
		generation: number | string;
		mitgliedsart: string;
		mitgliedsrolle: string;
		beraterstufe: string;
		imageUrl?: string | null;
	};

	export let member: Member;

	const initials = member.name
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
</script>

<Card>
	<CardContent class="p-4">
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 min-w-0">
				<Avatar class="h-12 w-12 rounded-lg">
					<AvatarImage src={member.imageUrl ?? undefined} alt={member.name} class="object-cover" />
					<AvatarFallback class="rounded-lg">{initials}</AvatarFallback>
				</Avatar>
				<div class="min-w-0">
					<p class="font-medium truncate">{member.name}</p>
					<div class="mt-1 flex flex-wrap gap-2">
						<Badge>Generation {member.generation}</Badge>
						<Badge>{member.mitgliedsart}</Badge>
						<Badge>{member.mitgliedsrolle}</Badge>
						<Badge>{member.beraterstufe}</Badge>
					</div>
				</div>
			</div>
			<a href="/app/mitglieder/profil" class="shrink-0">
				<Button variant="outline">Profil ansehen</Button>
			</a>
		</div>
	</CardContent>
</Card>
