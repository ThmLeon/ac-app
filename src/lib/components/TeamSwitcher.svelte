<script lang="ts">
  import { ChevronsUpDown, Plus } from "lucide-svelte"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "$lib/components/ui/dropdown-menu"

  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "$lib/components/ui/sidebar"

  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";

  export let teams: {
    name: string
    logo: typeof Plus // any Lucide icon component
    plan: string
  }[]

  let activeTeam = teams?.[0]
</script>

{#if activeTeam}
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <svelte:component this={activeTeam.logo} class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{activeTeam.name}</span>
              <span class="truncate text-xs">{activeTeam.plan}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          class="min-w-56 rounded-lg"
          align="start"
          side={IsMobile ? "bottom" : "right"}
          sideOffset={4}
        >
          <DropdownMenuLabel class="text-muted-foreground text-xs">
            Teams
          </DropdownMenuLabel>

          {#each teams as team, index (team.name)}
            <DropdownMenuItem
              class="gap-2 p-2"
              on:click={() => (activeTeam = team)}
            >
              <div class="flex size-6 items-center justify-center rounded-md border">
                <svelte:component this={team.logo} class="size-3.5 shrink-0" />
              </div>
              {team.name}
              <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
            </DropdownMenuItem>
          {/each}

          <DropdownMenuSeparator />

          <DropdownMenuItem class="gap-2 p-2">
            <div class="flex size-6 items-center justify-center rounded-md border bg-transparent">
              <Plus class="size-4" />
            </div>
            <div class="text-muted-foreground font-medium">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
{/if}