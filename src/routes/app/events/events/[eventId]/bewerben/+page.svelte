<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { PageData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

{#await data.eventData}
	<PageLoadSkeleton />
{:then eventData}
	<EventDetailsHeader {eventData} />

	<form
		method="POST"
		class="mt-6 space-y-6"
		enctype="multipart/form-data"
		use:enhance={() => {
			toast.loading('Eingabe wird verarbeitet', {
				id: 'event_bewerbung_form'
			});

			return async ({ update, result }) => {
				await update();
				handleActionResultSonners(result, 'event_bewerbung_form');
				goto(`../${eventData.id}`);
			};
		}}
	>
		{#if eventData.anhang_benoetigt}
			<Card>
				<CardHeader>
					<CardTitle>Anhang</CardTitle>
					{#if eventData.anhang_beschreibung}
						<CardDescription>{eventData.anhang_beschreibung}</CardDescription>
					{/if}
				</CardHeader>
				<CardContent>
					<Input type="file" required id="anhang" name="anhang" class="w-[30%]" />
				</CardContent>
			</Card>
		{/if}

		{#if eventData.bewerbungstext_benoetigt}
			<Card>
				<CardHeader>
					<CardTitle>Bewerbungstext</CardTitle>
					{#if eventData.bewerbungstext_beschreibung}
						<CardDescription>{eventData.bewerbungstext_beschreibung}</CardDescription>
					{/if}
				</CardHeader>
				<CardContent>
					<Textarea
						id="bewerbungstext"
						name="bewerbungstext"
						rows={4}
						placeholder="Bewerbungstext eingeben..."
						required
					/>
				</CardContent>
			</Card>
		{/if}

		<input type="hidden" name="event_id" value={eventData.id} />

		<Button formaction="?/sendApplication" type="submit" class="w-full">Bewerben</Button>
	</form>
{/await}
