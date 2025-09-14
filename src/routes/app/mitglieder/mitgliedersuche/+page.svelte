<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuGroupHeading,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import MemberResultItem from '$lib/components/pages/mitglieder/mitgliedersuche/MemberResultItem.svelte';

	type Member = {
		id: number;
		name: string;
		generation: number | string;
		mitgliedsart: string;
		mitgliedsrolle: string;
		beraterstufe: string;
		imageUrl?: string | null;
	};

	// Local UI state (dummy values)
	let nameQuery = '';
	let selectedMitgliedsarten: string[] = [];
	let selectedMitgliedsrollen: string[] = [];
	let selectedBeraterstufen: string[] = [];
	let generation: number | '' = '';

	const mitgliedsarten = ['Aktiv', 'Passiv', 'Ehemalig'];
	const mitgliedsrollen = ['Trainee', 'Mitglied', 'Alumni'];
	const beraterstufen = [
		'Junior Consultant',
		'Consultant',
		'Senior Consultant',
		'Managing Consultant',
		'Director',
		'Managing Director'
	];

	const dummyMembers: Member[] = [
		{
			id: 1,
			name: 'Max Mustermann',
			generation: 23,
			mitgliedsart: 'Aktiv',
			mitgliedsrolle: 'Mitglied',
			beraterstufe: 'Consultant'
		},
		{
			id: 2,
			name: 'Erika Mustermann',
			generation: 22,
			mitgliedsart: 'Passiv',
			mitgliedsrolle: 'Alumni',
			beraterstufe: 'Senior Consultant'
		}
	];

	function toggleSel(list: string[], value: string) {
		const idx = list.indexOf(value);
		if (idx >= 0) list.splice(idx, 1);
		else list.push(value);
	}
</script>

<section class="p-6 space-y-6">
	<!-- Search Controls Card -->
	<Card class="p-6">
		<CardContent class="p-0">
			<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<!-- Left: Name search -->
				<div class="flex-1 min-w-0">
					<label class="sr-only" for="name-search">Name</label>
					<Input
						id="name-search"
						placeholder="Nach Namen suchen..."
						bind:value={nameQuery}
						class="w-full"
					/>
				</div>

				<!-- Right: Multi selects + generation -->
				<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-3 w-full lg:w-auto">
					<!-- Mitgliedsart -->
					<DropdownMenu>
						<DropdownMenuTrigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between">
									Mitgliedsart
									<ChevronDown class="size-4" />
								</Button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent class="min-w-56">
							<DropdownMenuLabel>Mitgliedsart wählen</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{#each mitgliedsarten as a}
									<DropdownMenuCheckboxItem
										checked={selectedMitgliedsarten.includes(a)}
										onclick={() => toggleSel(selectedMitgliedsarten, a)}
									>
										{a}
									</DropdownMenuCheckboxItem>
								{/each}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<!-- Mitgliedsrolle -->
					<DropdownMenu>
						<DropdownMenuTrigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between">
									Mitgliedsrolle
									<ChevronDown class="size-4" />
								</Button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent class="min-w-56">
							<DropdownMenuLabel>Mitgliedsrolle wählen</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{#each mitgliedsrollen as r}
									<DropdownMenuCheckboxItem
										checked={selectedMitgliedsrollen.includes(r)}
										onclick={() => toggleSel(selectedMitgliedsrollen, r)}
									>
										{r}
									</DropdownMenuCheckboxItem>
								{/each}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<!-- Beraterstufen -->
					<DropdownMenu>
						<DropdownMenuTrigger>
							{#snippet child({ props })}
								<Button {...props} variant="outline" class="w-full justify-between">
									Beraterstufen
									<ChevronDown class="size-4" />
								</Button>
							{/snippet}
						</DropdownMenuTrigger>
						<DropdownMenuContent class="min-w-64">
							<DropdownMenuLabel>Beraterstufe wählen</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{#each beraterstufen as b}
									<DropdownMenuCheckboxItem
										checked={selectedBeraterstufen.includes(b)}
										onclick={() => toggleSel(selectedBeraterstufen, b)}
									>
										{b}
									</DropdownMenuCheckboxItem>
								{/each}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<!-- Generation -->
					<div>
						<label class="sr-only" for="generation">Generation</label>
						<Input
							id="generation"
							type="number"
							min={0}
							placeholder="Generation"
							bind:value={generation}
						/>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Results List -->
	<div class="space-y-3">
		{#each dummyMembers as member}
			<MemberResultItem {member} />
		{/each}
	</div>
</section>
