<script lang="ts">
	import ProfileHeader from '$lib/components/pages/mitglieder/profil/ProfileHeader.svelte';
	import KontaktdatenCard from '$lib/components/pages/mitglieder/profil/KontaktdatenCard.svelte';
	import StatusCard from '$lib/components/pages/mitglieder/profil/StatusCard.svelte';
	import BeraterstufeCard from '$lib/components/pages/mitglieder/profil/BeraterstufeCard.svelte';
	import RollenCard from '$lib/components/pages/mitglieder/profil/RollenCard.svelte';
	import ProjekteCard from '$lib/components/pages/mitglieder/profil/ProjekteCard.svelte';
	import SchulungenCard from '$lib/components/pages/mitglieder/profil/SchulungenCard.svelte';
	import BankdatenCard from '$lib/components/pages/mitglieder/profil/BankdatenCard.svelte';
	import StudiumCard from '$lib/components/pages/mitglieder/profil/StudiumCard.svelte';
	import PassivscoreCard from '$lib/components/pages/mitglieder/profil/PassivscoreCard.svelte';
	import EventsCard from '$lib/components/pages/mitglieder/profil/EventsCard.svelte';

	// Dummy data for header for now
	const mitgliedName = 'Max Mustermann';
	const tags = ['Aktives Mitglied', 'Vorstand'];
</script>

<section class="p-6 space-y-8">
	<ProfileHeader name={mitgliedName} {tags} />

	<div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
		<KontaktdatenCard />
		<StatusCard />
		<BeraterstufeCard />
		<RollenCard />
		<ProjekteCard />
		<SchulungenCard />
		<BankdatenCard />
		<StudiumCard />
		<PassivscoreCard />
		<EventsCard />
	</div>
</section>
