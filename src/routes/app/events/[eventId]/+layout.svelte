<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { LayoutData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import { page } from '$app/stores';
	import { getContext, onDestroy } from 'svelte';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Dynamically determine if we are on the /bewerben page
	let isBewerbenPage = $derived(
		$page.url.pathname.endsWith('/bewerben') || $page.url.pathname.endsWith('/besetzunganwesenheit')
	);

	// Get breadcrumb context from layout
	const breadcrumb = getContext<{
		setLabel: (segment: string, label: string) => void;
		clearLabel: (segment: string) => void;
	}>('breadcrumb');

	// Reactive override when data becomes available / changes
	$effect(() => {
		if (data?.eventData?.ID) {
			const id = String(data.eventData.ID);
			breadcrumb.setLabel(id, data.eventData.Titel || 'Event');
		}
	});

	// Cleanup on destroy to avoid stale overrides if navigating elsewhere quickly
	onDestroy(() => {
		if (data?.eventData?.ID) breadcrumb.clearLabel(String(data.eventData.ID));
	});
</script>

{#await data.eventData}
	<PageLoadSkeleton />
{:then eventData}
	<EventDetailsHeader
		userId={data.userId}
		{eventData}
		applicationState={data.applicationState}
		totalApplications={data.totalApplications}
		showApplyOrEditButton={!isBewerbenPage}
		eventImageUrl={data.eventImageUrl}
	/>
	{@render children()}
{/await}
