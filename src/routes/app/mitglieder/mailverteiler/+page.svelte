<script lang="ts">
	import MailverteilerItem from '$lib/components/pages/mitglieder/mailverteiler/MailverteilerItem.svelte';
	type Verteiler = {
		id: number;
		title: string;
		description: string;
		subscribed?: boolean;
	};

	const verteilerListe: Verteiler[] = [
		{ id: 1, title: 'Allgemein', description: 'Allgemeine Ankündigungen und Infos.' },
		{ id: 2, title: 'Events', description: 'Benachrichtigungen zu kommenden Events.' },
		{ id: 3, title: 'Projekte', description: 'Projektbezogene Updates und Ausschreibungen.' },
		{ id: 4, title: 'Alumni', description: 'News und Informationen für Alumni.' }
	];
</script>

<section class="p-6 space-y-6">
	<h1 class="text-2xl font-semibold">Mailverteiler</h1>
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each verteilerListe as verteiler}
			<MailverteilerItem {verteiler} />
		{/each}
	</div>
</section>
