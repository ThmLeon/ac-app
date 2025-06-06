<script lang="ts">
	export let name: string;
	export let imageUrl: string;
</script>

<div class="flex items-center gap-4 pr-5 border-[1px] rounded-[8px] w-fit">
	<!-- Image Section -->
	<img src={imageUrl} alt={name} class="w-16 h-auto object-cover rounded-l-[6.5px]" />
	<!-- Ensure consistent border radius -->

	<!-- Name Section -->
	<p class="text-base font-normal whitespace-nowrap">{name}</p>
</div>
