<script lang="ts">
  import {
    Folder,
    Forward,
    MoreHorizontal,
    Trash2
  } from "lucide-svelte"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu"

  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "$lib/components/ui/sidebar"

  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";

  export let projects: {
    name: string
    url: string
    icon: typeof Folder
  }[]
</script>

<SidebarGroup class="group-data-[collapsible=icon]:hidden">
  <SidebarGroupLabel>Projects</SidebarGroupLabel>
  <SidebarMenu>
    {#each projects as project (project.name)}
      <SidebarMenuItem>
        <a href={project.url} class="w-full">
            <SidebarMenuButton>
                <svelte:component this={project.icon} />
                <span>{project.name}</span>
            </SidebarMenuButton>
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction showOnHover>
              <MoreHorizontal />
              <span class="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-48 rounded-lg"
            side={IsMobile ? "bottom" : "right"}
            align={IsMobile ? "end" : "start"}
          >
            <DropdownMenuItem>
              <Folder class="text-muted-foreground" />
              <span>View Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Forward class="text-muted-foreground" />
              <span>Share Project</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 class="text-muted-foreground" />
              <span>Delete Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    {/each}

    <SidebarMenuItem>
      <SidebarMenuButton class="text-sidebar-foreground/70">
        <MoreHorizontal class="text-sidebar-foreground/70" />
        <span>More</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarGroup>