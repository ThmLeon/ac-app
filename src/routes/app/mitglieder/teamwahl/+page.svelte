<script lang="ts">
	import { Progress } from '$lib/components/ui/progress';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';

	type Choice = 'aktiv' | 'passiv' | 'alumni' | null;
	let choice: Choice = null;

	// Passive path
	let passiveDate: string = '';

	// Active path state
	type CategoryKey = 'TPM' | 'KB' | 'F&R' | 'MPR' | 'Internes';
	const categories: CategoryKey[] = ['TPM', 'KB', 'F&R', 'MPR', 'Internes'];
	const teamsByCategory: Record<CategoryKey, string[]> = {
		TPM: ['TPM-Alpha', 'TPM-Beta', 'TPM-Gamma'],
		KB: ['KB-Research', 'KB-Analytics'],
		'F&R': ['F&R-Planning', 'F&R-Reporting'],
		MPR: ['MPR-Brand', 'MPR-Content'],
		Internes: ['IT', 'HR', 'Office']
	};

	type PrioKey = 1 | 2 | 3;
	type Selection = { category: CategoryKey; team: string; text: string; teamLead: boolean } | null;
	let activeCategory: CategoryKey = 'TPM';
	let prioStep: PrioKey = 1;
	let prioSelections: Record<PrioKey, Selection> = { 1: null, 2: null, 3: null };

	// Kernteam
	const kernteams = ['Kern Orga', 'Kern Finanzen', 'Kern Marketing'];
	let kernteamSelection: { team: string; text: string; teamLead: boolean } | null = null;

	// Sonstige Rollen (multi-select)
	const sonstigeRollen = ['Mentor', 'IT-Support', 'Event-Assistenz', 'Fotografie'];
	let sonstigeInteressen = new Set<string>();

	// Alumni path has no extra fields

	// Wizard step tracking
	type ActiveSubStep = 'prio' | 'kernteam' | 'sonstige' | 'kontrolle';
	let activeSubStep: ActiveSubStep = 'prio';

	function totalSteps(): number {
		if (choice === 'passiv') return 2; // Auswahl + Datum & Abschicken
		if (choice === 'alumni') return 2; // Auswahl + Abschicken
		if (choice === 'aktiv') return 6; // Auswahl + (Prio1, Prio2, Prio3, Kernteam, Sonstige, Kontrolle)
		return 1; // Auswahl
	}

	function currentStepIndex(): number {
		if (choice === null) return 1;
		if (choice === 'passiv') return passiveDate === undefined ? 2 : 2; // second screen
		if (choice === 'alumni') return 2;
		if (choice === 'aktiv') {
			// selection is step 1; sub-steps 2..6
			switch (activeSubStep) {
				case 'prio':
					return 1 + prioStep; // 1 (choice) + prio step (1..3) => 2..4
				case 'kernteam':
					return 5; // after prio3
				case 'sonstige':
					return 6; // next
				case 'kontrolle':
					return 7; // logical last, but our total is 6; map to 6 below
			}
		}
		return 1;
	}

	$: progressValue = (() => {
		const t = totalSteps();
		let idx = currentStepIndex();
		// Clamp idx to total
		if (choice === 'aktiv') {
			// Remap 7 to 6 for display
			if (idx > 6) idx = 6;
		} else if (idx > t) idx = t;
		return Math.round((idx / t) * 100);
	})();

	function selectTeam(prio: PrioKey, category: CategoryKey, team: string) {
		prioSelections[prio] = { category, team, text: '', teamLead: false };
	}

	function prioNext() {
		if (prioStep < 3) prioStep = (prioStep + 1) as PrioKey;
		else activeSubStep = 'kernteam';
	}
	function prioPrev() {
		if (prioStep > 1) prioStep = (prioStep - 1) as PrioKey;
	}
</script>

<section class="p-6 space-y-6">
	<!-- Status / Progress bar -->
	<div class="space-y-2">
		<div class="flex items-center justify-between text-sm text-muted-foreground">
			<span>Fortschritt</span>
			<span>{progressValue}%</span>
		</div>
		<Progress value={progressValue} />
	</div>

	{#if choice === null}
		<!-- First screen: choose path -->
		<div class="grid gap-4 md:grid-cols-3">
			<Card class="cursor-pointer" onclick={() => (choice = 'aktiv')}>
				<CardHeader>
					<CardTitle>Aktives Mitglied</CardTitle>
					<CardDescription
						>Wähle Teams in drei Prioritäten, Kernteam und weitere Rollen.</CardDescription
					>
				</CardHeader>
			</Card>
			<Card class="cursor-pointer" onclick={() => (choice = 'passiv')}>
				<CardHeader>
					<CardTitle>Passives Mitglied</CardTitle>
					<CardDescription>Wechsle in den passiven Status ab einem gewählten Datum.</CardDescription
					>
				</CardHeader>
			</Card>
			<Card class="cursor-pointer" onclick={() => (choice = 'alumni')}>
				<CardHeader>
					<CardTitle>Alumnus/Alumna</CardTitle>
					<CardDescription>Wechsle in den Alumni-Status und bleibe vernetzt.</CardDescription>
				</CardHeader>
			</Card>
		</div>
	{:else if choice === 'passiv'}
		<!-- Passive screen -->
		<Card>
			<CardHeader>
				<CardTitle>Passiver Status</CardTitle>
				<CardDescription
					>Bitte wähle ein Datum, ab dem dein Status auf passiv gewechselt werden soll.</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div>
					<label for="passive-date" class="block text-sm text-muted-foreground mb-1">Datum</label>
					<Input id="passive-date" type="date" bind:value={passiveDate} class="w-full sm:w-80" />
				</div>
				<div class="flex justify-between">
					<Button variant="outline" onclick={() => (choice = null)}>Zurück</Button>
					<Button>Abschicken</Button>
				</div>
			</CardContent>
		</Card>
	{:else if choice === 'alumni'}
		<!-- Alumni screen -->
		<Card>
			<CardHeader>
				<CardTitle>Alumni-Status</CardTitle>
				<CardDescription
					>Hiermit wechselst du in den Alumni-Status. Du erhältst weiterhin relevante Informationen
					und kannst in Kontakt bleiben.</CardDescription
				>
			</CardHeader>
			<CardContent class="flex justify-between">
				<Button variant="outline" onclick={() => (choice = null)}>Zurück</Button>
				<Button>Abschicken</Button>
			</CardContent>
		</Card>
	{:else if choice === 'aktiv'}
		<!-- Active member multi-step -->
		{#if activeSubStep === 'prio'}
			<Card>
				<CardHeader>
					<CardTitle>Priorität {prioStep}</CardTitle>
					<CardDescription
						>Wähle eine Kategorie und ein Team. Danach kannst du deine Bewerbung schreiben und
						angeben, ob du Teamleitung übernehmen möchtest.</CardDescription
					>
				</CardHeader>
				<CardContent class="space-y-4">
					<!-- Reiter -->
					<div class="flex flex-wrap gap-2">
						{#each categories as cat}
							<Button
								variant={activeCategory === cat ? 'default' : 'outline'}
								onclick={() => (activeCategory = cat)}
								class="rounded-full">{cat}</Button
							>
						{/each}
					</div>

					<!-- Teams list -->
					<div class="space-y-2">
						{#each teamsByCategory[activeCategory] as team}
							<Card>
								<CardContent class="p-4">
									<div class="flex items-start justify-between gap-3">
										<div class="pt-1">
											<p class="font-medium">{team}</p>
										</div>
										<Button
											variant="outline"
											onclick={() => selectTeam(prioStep, activeCategory, team)}>Team wählen</Button
										>
									</div>
									{#if prioSelections[prioStep]?.team === team}
										<div class="mt-3 space-y-2">
											<label
												for="prio-bewerbung-{prioStep}"
												class="block text-sm text-muted-foreground"
												>Schreibe hier deine Bewerbung:</label
											>
											<Textarea
												id="prio-bewerbung-{prioStep}"
												bind:value={prioSelections[prioStep]!.text}
												placeholder="Dein Text..."
											/>
											<label class="flex items-center gap-2 text-sm">
												<Checkbox bind:checked={prioSelections[prioStep]!.teamLead} />
												Als Teamleitung bewerben
											</label>
										</div>
									{/if}
								</CardContent>
							</Card>
						{/each}
					</div>

					<div class="flex justify-between pt-2">
						<Button variant="outline" onclick={prioPrev} disabled={prioStep === 1}>Zurück</Button>
						<Button onclick={prioNext} disabled={!prioSelections[prioStep]}>Weiter</Button>
					</div>
				</CardContent>
			</Card>
		{:else if activeSubStep === 'kernteam'}
			<Card>
				<CardHeader>
					<CardTitle>Kernteam</CardTitle>
					<CardDescription
						>Wähle ein Kernteam und verfasse deine Bewerbung. Du kannst angeben, ob du Teamleitung
						übernehmen möchtest.</CardDescription
					>
				</CardHeader>
				<CardContent class="space-y-3">
					{#each kernteams as kt}
						<Card>
							<CardContent class="p-4">
								<div class="flex items-start justify-between gap-3">
									<p class="font-medium pt-1">{kt}</p>
									<Button
										variant="outline"
										onclick={() => (kernteamSelection = { team: kt, text: '', teamLead: false })}
										>Team wählen</Button
									>
								</div>
								{#if kernteamSelection?.team === kt}
									<div class="mt-3 space-y-2">
										<label for="kernteam-bewerbung" class="block text-sm text-muted-foreground"
											>Schreibe hier deine Bewerbung:</label
										>
										<Textarea
											id="kernteam-bewerbung"
											bind:value={kernteamSelection.text}
											placeholder="Dein Text..."
										/>
										<label class="flex items-center gap-2 text-sm">
											<Checkbox bind:checked={kernteamSelection.teamLead} />
											Als Teamleitung bewerben
										</label>
									</div>
								{/if}
							</CardContent>
						</Card>
					{/each}
					<div class="flex justify-between pt-2">
						<Button
							variant="outline"
							onclick={() => {
								activeSubStep = 'prio';
								prioStep = 3;
							}}>Zurück</Button
						>
						<Button onclick={() => (activeSubStep = 'sonstige')} disabled={!kernteamSelection}
							>Weiter</Button
						>
					</div>
				</CardContent>
			</Card>
		{:else if activeSubStep === 'sonstige'}
			<Card>
				<CardHeader>
					<CardTitle>Sonstige Rollen</CardTitle>
					<CardDescription>Wähle beliebig viele Rollen, an denen du Interesse hast.</CardDescription
					>
				</CardHeader>
				<CardContent class="space-y-3">
					<div class="grid gap-2 sm:grid-cols-2">
						{#each sonstigeRollen as rolle}
							<Card
								class="cursor-pointer"
								onclick={() => {
									sonstigeInteressen.has(rolle)
										? sonstigeInteressen.delete(rolle)
										: sonstigeInteressen.add(rolle);
								}}
							>
								<CardContent class="p-4 flex items-center justify-between">
									<span>{rolle}</span>
									<Button variant={sonstigeInteressen.has(rolle) ? 'default' : 'outline'}
										>Interesse</Button
									>
								</CardContent>
							</Card>
						{/each}
					</div>
					<div class="flex justify-between pt-2">
						<Button variant="outline" onclick={() => (activeSubStep = 'kernteam')}>Zurück</Button>
						<Button onclick={() => (activeSubStep = 'kontrolle')}>Weiter</Button>
					</div>
				</CardContent>
			</Card>
		{:else if activeSubStep === 'kontrolle'}
			<Card>
				<CardHeader>
					<CardTitle>Kontrolle</CardTitle>
					<CardDescription>Prüfe deine Angaben, bevor du abschickst.</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<div>
						<h3 class="font-semibold mb-2">Prioritäten</h3>
						<div class="space-y-2">
							{#each [1, 2, 3] as p}
								<div class="rounded-md border p-3">
									{#if prioSelections[p as PrioKey]}
										<p>
											<span class="font-medium">Prio {p}:</span>
											{prioSelections[p as PrioKey]!.category} — {prioSelections[p as PrioKey]!
												.team}
										</p>
										<p class="text-sm text-muted-foreground">
											Teamleitung: {prioSelections[p as PrioKey]!.teamLead ? 'Ja' : 'Nein'}
										</p>
										{#if prioSelections[p as PrioKey]!.text}
											<p class="text-sm mt-1">{prioSelections[p as PrioKey]!.text}</p>
										{/if}
									{:else}
										<p class="text-muted-foreground">Keine Auswahl</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>

					<div>
						<h3 class="font-semibold mb-2">Kernteam</h3>
						<div class="rounded-md border p-3">
							{#if kernteamSelection}
								<p><span class="font-medium">{kernteamSelection.team}</span></p>
								<p class="text-sm text-muted-foreground">
									Teamleitung: {kernteamSelection.teamLead ? 'Ja' : 'Nein'}
								</p>
								{#if kernteamSelection.text}
									<p class="text-sm mt-1">{kernteamSelection.text}</p>
								{/if}
							{:else}
								<p class="text-muted-foreground">Keine Auswahl</p>
							{/if}
						</div>
					</div>

					<div>
						<h3 class="font-semibold mb-2">Sonstige Rollen</h3>
						<div class="rounded-md border p-3 text-sm">
							{#if sonstigeInteressen.size > 0}
								{[...sonstigeInteressen].join(', ')}
							{:else}
								<span class="text-muted-foreground">Keine Auswahl</span>
							{/if}
						</div>
					</div>

					<div class="flex justify-between pt-2">
						<Button variant="outline" onclick={() => (activeSubStep = 'sonstige')}>Zurück</Button>
						<Button>Abschicken</Button>
					</div>
				</CardContent>
			</Card>
		{/if}
	{/if}
</section>
