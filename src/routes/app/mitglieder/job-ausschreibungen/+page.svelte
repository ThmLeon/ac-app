<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetDescription,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	type Job = {
		id: number;
		company: string;
		title: string;
		beginn: string; // ISO date or formatted
		frist: string; // ISO date or formatted
		logoUrl?: string;
		studienfortschritt: 'Bachelor' | 'Master' | 'Festeinstieg';
	};

	let filter: Job['studienfortschritt'] | 'Alle' = 'Alle';
	const jobs: Job[] = [
		{
			id: 1,
			company: 'Tech AG',
			title: 'Werkstudent Development',
			beginn: '01.10.2025',
			frist: '30.09.2025',
			studienfortschritt: 'Bachelor'
		},
		{
			id: 2,
			company: 'Consult GmbH',
			title: 'Praktikum Consulting',
			beginn: '15.10.2025',
			frist: '01.10.2025',
			studienfortschritt: 'Master'
		},
		{
			id: 3,
			company: 'Acme Corp',
			title: 'Junior Analyst',
			beginn: '01.11.2025',
			frist: '15.10.2025',
			studienfortschritt: 'Festeinstieg'
		}
	];

	$: filtered = filter === 'Alle' ? jobs : jobs.filter((j) => j.studienfortschritt === filter);
</script>

<section class="p-6 space-y-6">
	<!-- Filter -->
	<div class="flex items-center justify-between gap-4">
		<h1 class="text-2xl font-semibold">Job Ausschreibungen</h1>
		<div class="flex items-center gap-3">
			<Select type="single" bind:value={filter}>
				<SelectTrigger class="w-48"
					>{filter === 'Alle' ? 'Studienfortschritt' : filter}</SelectTrigger
				>
				<SelectContent>
					<SelectItem value="Alle">Alle</SelectItem>
					<SelectItem value="Bachelor">Bachelor</SelectItem>
					<SelectItem value="Master">Master</SelectItem>
					<SelectItem value="Festeinstieg">Festeinstieg</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>

	<!-- List of Jobs -->
	<div class="space-y-3">
		{#each filtered as job}
			<Card>
				<CardContent class="p-4">
					<div class="flex items-center justify-between gap-4">
						<div class="flex items-center gap-4 min-w-0">
							<img
								src={job.logoUrl || 'https://via.placeholder.com/40'}
								alt={job.company}
								class="w-10 h-10 rounded-md object-cover"
							/>
							<div class="min-w-0">
								<p class="font-medium truncate">{job.company}</p>
								<p class="truncate">{job.title}</p>
								<p class="text-sm text-muted-foreground">
									Beginn: {job.beginn} • Bewerbungsfrist: {job.frist}
								</p>
							</div>
						</div>
						<Sheet>
							<SheetTrigger>
								{#snippet child({ props })}
									<Button {...props} variant="outline">Details</Button>
								{/snippet}
							</SheetTrigger>
							<SheetContent side="right" class="w-[90vw] sm:w-[560px]">
								<SheetHeader>
									<SheetTitle>{job.title}</SheetTitle>
									<SheetDescription>{job.company}</SheetDescription>
								</SheetHeader>
								<div class="mt-4">
									<!-- Placeholder for PDF view -->
									<div
										class="aspect-[3/4] w-full border rounded-md grid place-items-center text-muted-foreground"
									>
										PDF File
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
</section>
