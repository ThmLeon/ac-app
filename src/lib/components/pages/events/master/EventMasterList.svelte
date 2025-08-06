<script context="module" lang="ts">
	import type { Database } from '@/server/supabase/database.types';

	//generate the type from database for a row from 04_EventMaster
	export type EventMaster = Pick<
		Database['public']['Tables']['4_EventMaster']['Row'],
		'id' | 'Titel' | 'MasterBeschreibung' | 'Eventart'
	>;
	export type EventMasters = EventMaster[];
</script>

<script lang="ts">
	import EventMasterCard from '$lib/components/events/EventMasterCard.svelte';

	export let eventMasters: EventMasters;
	export let onAddNew: () => void;
	export let onEdit: (id: EventMaster['id']) => void;
</script>

<div class="flex flex-wrap justify-start gap-4">
	<button
		class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg w-[350px] cursor-pointer"
		title="Neuen Event Master hinzufügen"
		on:click={onAddNew}
	>
		<span class="text-4xl text-gray-400">+</span>
	</button>

	{#each eventMasters as eventMaster (eventMaster.id)}
		<div class="flex justify-center">
			<EventMasterCard
				onEdit={() => {
					onEdit(eventMaster.id);
				}}
				{eventMaster}
			/>
		</div>
	{/each}
</div>
