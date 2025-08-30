<script lang="ts">
	import EventCard from '@/components/events/EventCard.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { filterEventsSchema } from '@/schemas/filterEventsSchema';

	let isLoading = false;
	const { form } = superForm(filterEventsSchema.parse({}), {
		validators: zodClient(filterEventsSchema)
	});

	let allEvents: any = [];

	onMount(async () => {
		await loadEvents(false);
	});

	async function loadEvents(filterChange: boolean) {
		isLoading = true;

		if (filterChange) {
			$form.skip = 0;
			$form.limit = 10;
		} else {
			$form.skip = allEvents.length;
			$form.limit = allEvents.length + 10;
		}

		const formData = new FormData();
		Object.entries($form).forEach(([key, value]) => {
			formData.set(key, String(value));
		});

		const response = await fetch('?/', {
			method: 'POST',
			body: formData
		});
		if (filterChange) {
			allEvents = (await response.json()).events;
		} else {
			allEvents = [...allEvents, ...(await response.json()).events];
		}
		isLoading = false;
	}
</script>

<div class="container mx-auto pt-5">
	<div class="flex justify-between items-center">
		<a href={`./events/neuesEvent`}>
			<Button variant="default">Neues Event hinzufügen</Button>
		</a>

		<form>
			<div class="flex items-center gap-4">
				<Input
					type="text"
					placeholder="Nach Name filtern..."
					class="w-64"
					bind:value={$form.textSearch}
					oninput={() => loadEvents(true)}
				/>

				<Select type="single" bind:value={$form.dateFilter} onValueChange={() => loadEvents(true)}>
					<SelectTrigger class="w-48"
						>{$form.dateFilter === 'all'
							? 'Datum'
							: $form.dateFilter === 'upcoming'
								? 'Kommende Events'
								: 'Vergangene Events'}</SelectTrigger
					>
					<SelectContent>
						<SelectItem value="all">Alle</SelectItem>
						<SelectItem value="upcoming">Kommende Events</SelectItem>
						<SelectItem value="past">Vergangene Events</SelectItem>
					</SelectContent>
				</Select>

				<Select
					type="single"
					bind:value={$form.statusFilter}
					onValueChange={() => loadEvents(true)}
				>
					<SelectTrigger class="w-48"
						>{$form.statusFilter === 'all'
							? 'Bewerbungsstatus'
							: $form.statusFilter.charAt(0).toUpperCase() +
								$form.statusFilter.slice(1)}</SelectTrigger
					>
					<SelectContent>
						<SelectItem value="all">Alle</SelectItem>
						<SelectItem value="beworben">Beworben</SelectItem>
						<SelectItem value="besetzt">Besetzt</SelectItem>
						<SelectItem value="anwesend">Anwesend</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</form>
	</div>
</div>

<div class="container mx-auto p-4 space-y-4">
	{#each allEvents as event, index}
		<EventCard {event} />
		{#if index === allEvents.length - 4}
			<div
				use:inview
				on:inview_change={(event) => {
					const { inView } = event.detail;
					if (inView && !isLoading) {
						loadEvents(false);
					}
				}}
			></div>
		{/if}
	{/each}

	{#if isLoading}
		<div class="text-center py-4">
			<p>Lade weitere Events...</p>
		</div>
	{:else if allEvents.length === 0}
		<div class="text-center py-4">
			<p>Keine Events gefunden.</p>
		</div>
	{/if}
</div>
