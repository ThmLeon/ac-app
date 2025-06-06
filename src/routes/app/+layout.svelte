<script>
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

	let { data, children } = $props();
</script>

<SidebarProvider>
	<AppSidebar
		name={data.data.userDetails.vorname + ' ' + data.data.userDetails.nachname}
		avatarUrl=""
	/>
	<SidebarInset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem class="hidden md:block">
							<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator class="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Data Fetching</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>

		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children()}
		</div>
	</SidebarInset>
</SidebarProvider>
