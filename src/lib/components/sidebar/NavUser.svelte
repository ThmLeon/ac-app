<script lang="ts">
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';

	export let name: string;
	export let avatarUrl: string;

	const getInitials = (name: string) => {
		const names = name.split(' ');
		if (names.length > 1) {
			return names[0].charAt(0) + names[1].charAt(0);
		}
		return names[0].charAt(0);
	};
</script>

<div class="flex items-center gap-2 pl-2 pt-4">
	<Avatar class="h-8 w-8 rounded-lg">
		<AvatarImage src={avatarUrl} alt={name} />
		<AvatarFallback class="rounded-lg">{getInitials(name)}</AvatarFallback>
	</Avatar>
	<div class="grid text-left text-sm leading-tight">
		<span class="truncate font-medium">{name}</span>
		<span class="truncate text-xs">Aktives Mitglied</span>
	</div>
</div>
