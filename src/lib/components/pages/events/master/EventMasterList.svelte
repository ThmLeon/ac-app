<script context="module" lang="ts">
	import type { Database } from '@/api/supabase/database.types';

	//generate the type from database for a row from 04_EventMaster
	export type EventMaster = Pick<
		Database['public']['Tables']['4_EventMaster']['Row'],
		'ID' | 'Titel' | 'MasterBeschreibung' | 'Eventart'
	>;
	export type EventMasters = EventMaster[];
</script>

<script lang="ts">
	import EventMasterCard from '$lib/components/events/EventMasterCard.svelte';

	export let eventMasters: EventMasters;
	export let canEdit: boolean;
	export let canCreate: boolean;
	export let canDelete: boolean;
	export let prepareForm: (ID: EventMaster['ID']) => void;
</script>

<div class="flex flex-wrap justify-start gap-4">
	{#if canCreate}
		<button
			class="flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg w-[350px] cursor-pointer"
			title="Neuen Event Master hinzufügen"
			on:click={() => {
				prepareForm(-1);
			}}
		>
			<span class="text-4xl text-gray-400">+</span>
		</button>
	{/if}

	{#each eventMasters as eventMaster (eventMaster.ID)}
		<div class="flex justify-center">
			<EventMasterCard
				onEdit={() => {
					prepareForm(eventMaster.ID);
				}}
				{eventMaster}
				{canDelete}
				{canEdit}
			/>
		</div>
	{/each}
</div>
