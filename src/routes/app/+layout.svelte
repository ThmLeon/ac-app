<script lang="ts">
	import AppSidebar from '@/components/sidebar/AppSidebar.svelte';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import { SidebarInset, SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { derived, writable, type Readable } from 'svelte/store';
	import { setContext } from 'svelte';
	import FeedbackDialog from '@/components/feedback/FeedbackDialog.svelte';

	let { data, children } = $props();

	const fullName = data.user?.user_metadata.full_name ?? 'User';
	const firstName = fullName.split(' ')[0];
	const lastName = fullName.split(' ')[1];

	// Map of segmentValue -> override label (e.g. eventId -> Event Name)
	const overrides = writable<Map<string, string>>(new Map());

	// Keep overrides clean when navigation happens (remove unused segment values)
	page.subscribe(($page) => {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		overrides.update((m) => {
			for (const key of Array.from(m.keys())) {
				if (!segments.includes(key)) m.delete(key);
			}
			return m;
		});
	});

	interface Crumb {
		segment: string; // raw segment value
		href: string; // cumulative href
		label: string; // displayed label
	}

	function formatSegment(segment: string): string {
		if (segment === 'app') return 'App';
		return segment.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	const breadcrumbs: Readable<Crumb[]> = derived([page, overrides], ([$page, $overrides]) => {
		const path = $page.url.pathname.replace(/\/+$/, '');
		const segments = path.split('/').filter(Boolean); // e.g. ['app','events','250']
		const crumbs: Crumb[] = [];
		let acc: string[] = [];
		for (const seg of segments) {
			acc.push(seg);
			const href = '/' + acc.join('/');
			const label = $overrides.get(seg) ?? formatSegment(seg);
			crumbs.push({ segment: seg, href, label });
		}
		return crumbs;
	});

	function setLabel(segmentValue: string, label: string) {
		overrides.update((m) => {
			m.set(segmentValue, label);
			return m;
		});
	}

	function clearLabel(segmentValue: string) {
		overrides.update((m) => {
			m.delete(segmentValue);
			return m;
		});
	}

	// Expose context so pages (e.g. /app/events/[eventId]) can override param labels
	setContext('breadcrumb', { setLabel, clearLabel });
</script>

<Toaster position="top-right" />
<SidebarProvider>
	<AppSidebar name={firstName + ' ' + lastName} avatarUrl="" />
	<SidebarInset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{#each $breadcrumbs as crumb, i}
							<BreadcrumbItem class={i === 0 ? 'hidden md:block' : ''}>
								{#if i < $breadcrumbs.length - 1}
									<BreadcrumbLink
										href={crumb.href}
										class="max-w-[160px] truncate inline-block align-middle"
										title={crumb.label}>{crumb.label}</BreadcrumbLink
									>
								{:else}
									<BreadcrumbPage>
										<span
											class="max-w-[200px] truncate inline-block align-middle"
											title={crumb.label}>{crumb.label}</span
										>
									</BreadcrumbPage>
								{/if}
							</BreadcrumbItem>
							{#if i < $breadcrumbs.length - 1}
								<BreadcrumbSeparator class={i === 0 ? 'hidden md:block' : ''} />
							{/if}
						{/each}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>

		<div class="flex flex-1 flex-col gap-4 p-4">
			{@render children()}
		</div>
	</SidebarInset>
</SidebarProvider>

<FeedbackDialog form={(data as any).feedbackForm} />
