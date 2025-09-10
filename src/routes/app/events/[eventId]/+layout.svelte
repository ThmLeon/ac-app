<script lang="ts">
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { LayoutData } from './$types';
	import EventDetailsHeader from '@/components/events/EventDetailsHeader.svelte';
	import { page } from '$app/stores';
	import BreadcrumbOverride from '$lib/components/general/BreadcrumbOverride.svelte';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Dynamically determine if we are on the /bewerben page
	let isBewerbenPage = $derived(
		$page.url.pathname.endsWith('/bewerben') ||
			$page.url.pathname.endsWith('/besetzen') ||
			$page.url.pathname.endsWith('/bearbeiten')
	);
</script>

<!-- Provide breadcrumb override (renders nothing) -->
{#if data?.eventData?.ID}
	<BreadcrumbOverride segment={data.eventData.ID} label={data.eventData.Titel || 'Event'} />
{/if}

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
