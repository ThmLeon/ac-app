<script>
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="h-full w-full p-4 flex flex-col gap-4">
	<!-- Full width skeleton at the top - 35% height -->
	<Skeleton class="h-[50%] w-full rounded-lg" />

	<!-- Two skeletons in a row below - 35% height -->
	<div class="h-[50%] grid grid-cols-2 gap-4">
		<Skeleton class="h-full w-full rounded-lg" />
		<Skeleton class="h-full w-full rounded-lg" />
	</div>
</div>
