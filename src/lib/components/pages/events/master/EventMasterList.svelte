<script lang="ts">
	import EventMasterCard from '$lib/components/events/EventMasterCard.svelte';
	export let eventMasters: any;
	export let onAddNew: () => void;
	export let onEdit: (id: number) => void;
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
				id={eventMaster.id.toString()}
				onEdit={() => {
					onEdit(eventMaster.id);
				}}
				name={eventMaster.Title!}
				description={eventMaster.MasterBeschreibung!}
				width="350px"
			/>
		</div>
	{/each}
</div>
