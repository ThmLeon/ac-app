<script lang="ts">
	import { Settings, LogOut } from 'lucide-svelte';
	import { Button } from '../ui/button';
</script>

<div class="flex items-center justify-end p-2 gap-1">
	<form action="/auth/logout" method="post">
		<Button type="submit" variant="ghost" size="icon" class="p-1.5">
			<LogOut class="h-4 w-4 text-gray-700" />
		</Button>
	</form>
	<Button variant="ghost" size="icon" class="p-1.5">
		<Settings class="h-4 w-4 text-gray-600" />
	</Button>
</div>
