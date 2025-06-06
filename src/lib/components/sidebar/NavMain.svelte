<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

	import {
		SidebarGroup,
		SidebarGroupLabel,
		SidebarMenu,
		SidebarMenuButton,
		SidebarMenuItem,
		SidebarMenuSub,
		SidebarMenuSubButton,
		SidebarMenuSubItem
	} from '$lib/components/ui/sidebar';

	export let items: {
		title: string;
		url: string;
		icon?: typeof ChevronRight; // accepts LucideIcon components
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
</script>

<SidebarGroup>
	<SidebarGroupLabel>AC-APP</SidebarGroupLabel>
	<SidebarMenu>
		{#each items as item (item.title)}
			<Collapsible class="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger>
						<SidebarMenuButton title={item.title}>
							{#if item.icon}
								<svelte:component this={item.icon} />
							{/if}
							<span>{item.title}</span>
							<ChevronRight
								class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
							/>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{#each item.items ?? [] as subItem (subItem.title)}
								<SidebarMenuSubItem>
									<SidebarMenuSubButton>
										<a href={subItem.url}>
											<span>{subItem.title}</span>
										</a>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							{/each}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		{/each}
	</SidebarMenu>
</SidebarGroup>
