<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import SchulungInstanceList from '$lib/components/pages/schulungen/master/SchulungInstanceList.svelte';
	import { schulungenMasters, type SchulungInstance } from '$lib/data/mockSchulungenMasters';

	type DateFilter = 'all' | 'upcoming' | 'past';
	type StatusFilter = 'all' | 'beworben' | 'besetzt' | 'anwesend';
	type HeldFilter = 'all' | 'mine' | 'notMine';

	const allInstances: SchulungInstance[] = schulungenMasters.flatMap((master) =>
		master.instances.map((instance) => ({
			...instance,
			masterId: master.id,
			masterName: master.name
		}))
	);

	let nameFilter = $state('');
	let dateFilter: DateFilter = $state('all');
	let statusFilter: StatusFilter = $state('all');
	let heldFilter: HeldFilter = $state('all');

	let filteredInstances: SchulungInstance[] = $state(allInstances);

	const today = new Date();
	const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	function parseDate(dateString: string) {
		const segments = dateString.split('.');
		if (segments.length === 3) {
			const [day, month, year] = segments.map(Number);
			return new Date(year, month - 1, day);
		}
		const parsed = new Date(dateString);
		return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
	}

	$effect(() => {
		const searchTerm = nameFilter.trim().toLowerCase();

		const next = allInstances
			.filter((instance) => {
				const instanceDate = parseDate(instance.date);
				const status = instance.status ?? 'offen';
				const isMine = instance.isLedByCurrentUser ?? false;

				if (searchTerm) {
					const matchesName =
						instance.name.toLowerCase().includes(searchTerm) ||
						(instance.masterName?.toLowerCase().includes(searchTerm) ?? false);
					if (!matchesName) return false;
				}

				if (dateFilter === 'upcoming' && instanceDate < todayStart) return false;
				if (dateFilter === 'past' && instanceDate >= todayStart) return false;

				if (statusFilter !== 'all' && status !== statusFilter) return false;

				if (heldFilter === 'mine' && !isMine) return false;
				if (heldFilter === 'notMine' && isMine) return false;

				return true;
			})
			.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

		filteredInstances = next;
	});
</script>

<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
	<section class="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
		<h1 class="text-2xl font-semibold">Schulungen</h1>
		<div class="flex flex-wrap items-center gap-3">
			<Input type="text" placeholder="Nach Name suchen..." class="w-56" bind:value={nameFilter} />

			<Select type="single" bind:value={dateFilter}>
				<SelectTrigger class="w-48">
					{dateFilter === 'all'
						? 'Datum'
						: dateFilter === 'upcoming'
							? 'Kommende Schulungen'
							: 'Vergangene Schulungen'}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="upcoming">Kommende Schulungen</SelectItem>
					<SelectItem value="past">Vergangene Schulungen</SelectItem>
				</SelectContent>
			</Select>

			<Select type="single" bind:value={statusFilter}>
				<SelectTrigger class="w-48">
					{statusFilter === 'all'
						? 'Bewerbungsstatus'
						: statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="beworben">Beworben</SelectItem>
					<SelectItem value="besetzt">Besetzt</SelectItem>
					<SelectItem value="anwesend">Anwesend</SelectItem>
				</SelectContent>
			</Select>

			<Select type="single" bind:value={heldFilter}>
				<SelectTrigger class="w-56">
					{heldFilter === 'all'
						? 'Schulung gehalten von'
						: heldFilter === 'mine'
							? 'Von mir gehalten'
							: 'Nicht von mir gehalten'}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Alle</SelectItem>
					<SelectItem value="mine">Von mir gehalten</SelectItem>
					<SelectItem value="notMine">Nicht von mir gehalten</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</section>

	<section class="flex flex-col gap-4">
		<SchulungInstanceList
			instances={filteredInstances}
			buttonLabel="Details"
			emptyMessage="Keine Schulungen gefunden."
			showMasterName
			linkToDetails
		/>
	</section>
</div>
