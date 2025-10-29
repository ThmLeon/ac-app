<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { LayoutData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import BreadcrumbOverride from '$lib/components/general/BreadcrumbOverride.svelte';
	import { eventsQueries } from '@/query/events';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import { getUserContext } from '@/context/userContext';
	import { setEventContext } from '@/context/eventContext';
	import type { EventDetails } from '@/context/eventContext';
	import { writable } from 'svelte/store';
	export const ssr = false;

	const { userDetails } = getUserContext();

	// Provide EventContext to children (e.g., EventDetailsHeader)
	const eventDetails = writable<EventDetails | null>(null);
	const eventImageURL = writable<string | null>(null);
	const totalApplications = writable<number>(0);
	setEventContext({ eventDetails, eventImageURL, totalApplications });

	let { data, children }: { data: LayoutData; children: any } = $props();
	const queries = eventsQueries(data.supabase, data.session!, useQueryClient());
	const eventDetailsFetched = queries.getDetails(Number(data.eventId), $userDetails.ID);

	$effect(() => {
		const res = $eventDetailsFetched.data;
		if (!res) return;
		eventDetails.set(res.eventDetails);
		eventImageURL.set(res.imageURL);
		totalApplications.set(res.totalApplications);
	});
</script>

{#if !$eventDetails}
	<PageLoadSkeleton />
{:else}
	<!-- Provide breadcrumb override (renders nothing) -->
	{#if $eventDetails.ID}
		<BreadcrumbOverride segment={$eventDetails.ID} label={$eventDetails.Titel || 'Event'} />
	{/if}

	{#if data.session}
		<EventDetailsHeader supabase={data.supabase} session={data.session} />
	{/if}
	{@render children()}
{/if}
