<script lang="ts">
	import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '$lib/components/ui/sidebar';
	import NavMain from './NavMain.svelte';
	import NavUser from './NavUser.svelte';

	import { BookOpen, Bot, Calendar, Settings2 } from 'lucide-svelte';
	import SidebarFooter from '../ui/sidebar/sidebar-footer.svelte';
	import NavFooter from './NavFooter.svelte';

	export let props = {};
	export let name: string;
	export let avatarUrl: string;

	const navItems = [
		{
			title: 'Events',
			url: '/app/events/allEvents',
			icon: Calendar,
			isActive: true,
			items: [
				{ title: 'Alle Events', url: '/app/events/events' },
				{ title: 'Events Master', url: '/app/events/master' }
			]
		},
		{
			title: 'Models',
			url: '#',
			icon: Bot,
			items: [
				{ title: 'Genesis', url: '#' },
				{ title: 'Explorer', url: '#' },
				{ title: 'Quantum', url: '#' }
			]
		},
		{
			title: 'Documentation',
			url: '#',
			icon: BookOpen,
			items: [
				{ title: 'Introduction', url: '#' },
				{ title: 'Get Started', url: '#' },
				{ title: 'Tutorials', url: '#' },
				{ title: 'Changelog', url: '#' }
			]
		},
		{
			title: 'Settings',
			url: '#',
			icon: Settings2,
			items: [
				{ title: 'General', url: '#' },
				{ title: 'Team', url: '#' },
				{ title: 'Billing', url: '#' },
				{ title: 'Limits', url: '#' }
			]
		}
	];
</script>

<Sidebar collapsible="icon" {...props}>
	<SidebarHeader>
		<!-- Add consistent padding to align with NavMain -->
		<NavUser {name} {avatarUrl} />
	</SidebarHeader>
	<SidebarContent>
		<NavMain items={navItems} />
	</SidebarContent>
	<SidebarFooter>
		<NavFooter />
	</SidebarFooter>
	<SidebarRail />
</Sidebar>
