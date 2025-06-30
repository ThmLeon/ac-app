<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { PageData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';

	export let data: PageData;
</script>

{#await data.eventData}
	<PageLoadSkeleton />
{:then eventData}
	<EventDetailsHeader {eventData} />

	{#if eventData.anhang_benoetigt}
		<div class="mt-4">
			<label for="anhang" class="block text-sm font-medium mb-2">Anhang</label>
			<input
				type="file"
				id="anhang"
				name="anhang"
				class="block w-full text-sm border border-gray-300 rounded-md p-2"
			/>
		</div>
	{/if}

	{#if eventData.bewerbungstext_benoetigt}
		<div class="mt-4">
			<label for="bewerbungstext" class="block text-sm font-medium mb-2">Bewerbungstext</label>
			<textarea
				id="bewerbungstext"
				name="bewerbungstext"
				rows="4"
				class="block w-full text-sm border border-gray-300 rounded-md p-2"
				placeholder="Bewerbungstext eingeben..."
			></textarea>
		</div>
	{/if}
{/await}
