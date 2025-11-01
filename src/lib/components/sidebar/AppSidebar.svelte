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
		Wallet2,
		User,
		Clock,
		Building
	} from 'lucide-svelte';
	import SidebarFooter from '../ui/sidebar/sidebar-footer.svelte';
	import NavFooter from './NavFooter.svelte';
	import { url } from 'valibot';
	import { is } from 'superstruct';
	import { isAborted } from 'zod';

	export let props = {};
	export let name: string;
	export let avatarUrl: string;

	const navItems = [
		/*{
			title: 'Mitglieder',
			url: '/app/mitglieder/profil',
			icon: User,
			isActive: true,
			items: [
				{ title: 'Mein Profil', url: '/app/mitglieder/profil' },
				{ title: 'Mitgliedersuche', url: '/app/mitglieder/mitgliedersuche' },
				{ title: 'Getränkeguthaben', url: '/app/mitglieder/getraenkeguthaben' },
				{ title: 'Mailverteiler', url: '/app/mitglieder/mailverteiler' },
				{ title: 'Rollenliste', url: '/app/mitglieder/rollenliste' },
				{ title: 'Teamwahl', url: '/app/mitglieder/teamwahl' },
				{ title: 'Job Ausschreibungen', url: '/app/mitglieder/job-ausschreibungen' }
			]
		},*/
		{
			title: 'Events',
			url: '/app/events',
			icon: Calendar,
			isActive: true,
			items: [
				{ title: 'Alle Events', url: '/app/events' },
				{ title: 'Events Master', url: '/app/events/master' }
			]
		},
		{
			title: 'Schulungen',
			url: '/app/schulungen',
			icon: BookOpen,
			isActive: true,
			items: [
				{ title: 'Alle Schulungen', url: '/app/schulungen' },
				{ title: 'Schulungen Master', url: '/app/schulungen/master' },
				{ title: 'Schulungen Bewerben', url: '/app/schulungen/bewerben' }
			]
		},
		/*{
			title: 'Büro',
			url: '/app/buero',
			icon: Building,
			isActive: true,
			items: [{ title: 'Bürodienst', url: '/app/buero/buerodienst' }]
		},*/
		{
			title: 'More coming soon...',
			url: '#',
			icon: Clock,
			isActive: false,
			items: []
		}
		/*{
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
		}*/
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
