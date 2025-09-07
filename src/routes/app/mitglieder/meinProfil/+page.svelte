<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import AdresseCard from '@/components/mitglieder/profil/AdresseCard.svelte';
	import KontaktdatenCard from '@/components/mitglieder/profil/KontaktdatenCard.svelte';
	import SchulungenCard from '@/components/mitglieder/profil/SchulungenCard.svelte';
	import BankdatenCard from '@/components/mitglieder/profil/BankdatenCard.svelte';
	import EventsCard from '@/components/mitglieder/profil/EventsCard.svelte';
	import ProfilHeader from '@/components/mitglieder/profil/ProfilHeader.svelte';
	import MitgliedsstatusCard from '@/components/mitglieder/profil/MitgliedsstatusCard.svelte';
	import BeraterstufeCard from '@/components/mitglieder/profil/BeraterstufeCard.svelte';
	import RollenCard from '@/components/mitglieder/profil/RollenCard.svelte';
	import ProjekteCard from '@/components/mitglieder/profil/ProjekteCard.svelte';
	import StudiumCard from '@/components/mitglieder/profil/StudiumCard.svelte';
	import PassivscoreCard from '@/components/mitglieder/profil/PassivscoreCard.svelte';
</script>

<div class="container mx-auto p-6 max-w-6xl">
	<!-- Profile Header -->
	<ProfilHeader />

	<Separator class="mb-4" />

	<!-- Information Grid -->
	<div class="grid gap-4 grid-cols-2">
		<AdresseCard />
		<KontaktdatenCard />
		<SchulungenCard />
		<BankdatenCard />
		<EventsCard />
		<MitgliedsstatusCard />
		<BeraterstufeCard />
		<RollenCard />
		<ProjekteCard />
		<StudiumCard />
		<PassivscoreCard />
	</div>
</div>
