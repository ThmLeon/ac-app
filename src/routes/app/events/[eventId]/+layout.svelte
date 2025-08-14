<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { LayoutData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import { page } from '$app/stores';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Dynamically determine if we are on the /bewerben page
	let isBewerbenPage = $derived(
		$page.url.pathname.endsWith('/bewerben') || $page.url.pathname.endsWith('/besetzunganwesenheit')
	);
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
	/>
	{@render children()}
{/await}
