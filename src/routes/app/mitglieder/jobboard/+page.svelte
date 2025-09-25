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
	import type { PageProps } from './$types';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';

	type JobboardFilter = {
		studienfortschritt: 'Alle' | 'Bachelor' | 'Master' | 'Festeinstieg';
	};

	let { data }: PageProps = $props();
	let jobboardFilter: JobboardFilter = {
		studienfortschritt: 'Alle'
	};
</script>

{#await data.jobboardAnzeigen}
	<PageLoadSkeleton />
{:then jobboardAnzeigen}
	<section class="p-6 space-y-6">
		<div class="flex items-center justify-between gap-4">
			<h1 class="text-2xl font-semibold">Job Ausschreibungen</h1>
			<div class="flex items-center gap-3">
				<Select type="single" bind:value={jobboardFilter.studienfortschritt}>
					<SelectTrigger class="w-48"
						>{jobboardFilter.studienfortschritt === 'Alle'
							? 'Studienfortschritt'
							: jobboardFilter.studienfortschritt}</SelectTrigger
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

		<div class="space-y-3">
			{#each jobboardAnzeigen as jobboardAnzeige}
				<Card>
					<CardContent class="p-4">
						<div class="flex items-center justify-between gap-4">
							<div class="flex items-center gap-4 min-w-0">
								<img
									src={'https://via.placeholder.com/40'}
									alt={jobboardAnzeige.Titel}
									class="w-10 h-10 rounded-md object-cover"
								/>
								<div class="min-w-0">
									<p class="text-sm text-muted-foreground">
										Beginn: {jobboardAnzeige.JobBeginn} • Bewerbungsfrist: {jobboardAnzeige.Bewerbungsdeadline}
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
										<SheetTitle>{jobboardAnzeige.Titel}</SheetTitle>
									</SheetHeader>
									<div class="mt-4">
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
{/await}
