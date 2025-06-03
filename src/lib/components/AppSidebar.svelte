<script lang="ts">
  import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "$lib/components/ui/sidebar"
    import NavMain from "./NavMain.svelte";
  import NavProjects from "./NavProjects.svelte"
  import NavUser from "./NavUser.svelte"
  import TeamSwitcher from "./TeamSwitcher.svelte"

  import { AudioWaveform, BookOpen, Bot, Calendar, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from "lucide-svelte"

  export let props = {}

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "",
    },
    teams: [
      { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
      { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
      { name: "Evil Corp.", logo: Command, plan: "Free" },
    ],
    navMain: [
      {
        title: "Events",
        url: "#",
        icon: Calendar,
        isActive: true,
        items: [
          { title: "Alle Events", url: "/app/events/allEvents" },
          { title: "Starred", url: "#" },
          { title: "Settings", url: "#" },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
          { title: "Genesis", url: "#" },
          { title: "Explorer", url: "#" },
          { title: "Quantum", url: "#" },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          { title: "Introduction", url: "#" },
          { title: "Get Started", url: "#" },
          { title: "Tutorials", url: "#" },
          { title: "Changelog", url: "#" },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          { title: "General", url: "#" },
          { title: "Team", url: "#" },
          { title: "Billing", url: "#" },
          { title: "Limits", url: "#" },
        ],
      },
    ],
    projects: [
      { name: "Design Engineering", url: "#", icon: Frame },
      { name: "Sales & Marketing", url: "#", icon: PieChart },
      { name: "Travel", url: "#", icon: Map },
    ],
  }
</script>

<Sidebar collapsible="icon" {...props}>
  <SidebarHeader>
    <TeamSwitcher teams={data.teams} />
  </SidebarHeader>
  <SidebarContent>
    <NavMain items={data.navMain} />
    <NavProjects projects={data.projects} />
  </SidebarContent>
  <SidebarFooter>
    <NavUser user={data.user} />
  </SidebarFooter>
  <SidebarRail />
</Sidebar>