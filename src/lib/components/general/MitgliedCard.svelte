<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { getInitials } from '@/app.utils';

	export let name: string;
	export let imageUrl: string;
</script>

<div class="flex items-center gap-2 pl-2 pt-4">
	<Avatar class="h-11 w-11 rounded-lg">
		<AvatarImage src={imageUrl} alt={name} />
		<AvatarFallback class="rounded-lg">{getInitials(name)}</AvatarFallback>
	</Avatar>
	<div class="grid text-left text-sm leading-tight">
		<span class="truncate font-medium">{name}</span>
		<span class="truncate text-xs">Aktives Mitglied</span>
	</div>
</div>
