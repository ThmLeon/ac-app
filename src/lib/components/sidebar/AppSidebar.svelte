<script lang="ts">
	import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '$lib/components/ui/sidebar';
	import NavMain from './NavMain.svelte';
	import NavUser from './NavUser.svelte';

	import {
		BookOpen,
		Bot,
		Calendar,
		Coins,
		Settings2,
		Euro,
		PiggyBank,
		Banknote,
		Wallet,
		Wallet2
	} from 'lucide-svelte';
	import SidebarFooter from '../ui/sidebar/sidebar-footer.svelte';
	import NavFooter from './NavFooter.svelte';

	export let props = {};
	export let name: string;
	export let avatarUrl: string;

	const navItems = [
		{
			title: 'Events',
			url: '/app/events/events',
			icon: Calendar,
			isActive: true,
			items: [
				{ title: 'Alle Events', url: '/app/events/events' },
				{ title: 'Events Master', url: '/app/events/master' }
			]
		},
		{
			title: 'Finanzen',
			url: '/app/finanzen',
			icon: Wallet,
			items: [
				{ title: 'Budgetierung', url: '/app/finanzen/budgetierung' },
				{ title: 'Auslagenerstattung', url: 'app/finanzen/auslagenerstattung' },
				{ title: 'Kontobuchungen', url: 'app/finanzen/kontobuchungen' }
			]
		},
		{
			title: 'Einstellungen',
			url: '#',
			icon: Settings2,
			items: [
				{ title: 'Persönlich', url: '#' },
				{ title: 'Organisation', url: '#' }
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
