<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import type { PageProps } from './$types';
	import MemberResultItem from '$lib/components/pages/mitglieder/mitgliedersuche/MemberResultItem.svelte';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
	import { inview } from 'svelte-inview';
	import PageLoadSkeleton from '@/components/general/PageLoadSkeleton.svelte';
	import type { MitgliederFilterType } from '@/types/mitglieder';
	import { onMount } from 'svelte';
	import { mitgliederQueries } from '@/query/mitglieder';

	let { data }: PageProps = $props();
	const queries = mitgliederQueries(data.supabase);

	let mitgliederFilter: MitgliederFilterType = $state({
		textSearch: '',
		mitgliedsart: [],
		mitgliedsrolle: [],
		beraterstufe: [],
		generation: null
	});

	const mitglieder = queries.listPaginatedFiltered(mitgliederFilter);

	$effect(() => {
		if (mitgliederFilter) {
			$mitglieder.refetch();
		}
	});
</script>

{#if !$mitglieder.data}
	<PageLoadSkeleton />
{:else}
	<section class="p-6 space-y-6">
		<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex-1 min-w-0">
				<Input
					type="text"
					placeholder="Nach Name suchen..."
					bind:value={mitgliederFilter.textSearch}
					class="w-full"
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-3 w-full lg:w-auto">
				<Select type="multiple" bind:value={mitgliederFilter.mitgliedsart}>
					<SelectTrigger class="w-48">Mitgliedsart</SelectTrigger>
					<SelectContent>
						<SelectItem value="Aktiv">Aktiv</SelectItem>
						<SelectItem value="Passiv">Passiv</SelectItem>
						<SelectItem value="Ehemalig">Ehemalig</SelectItem>
					</SelectContent>
				</Select>

				<Select type="multiple" bind:value={mitgliederFilter.mitgliedsrolle}>
					<SelectTrigger class="w-48">Mitgliedsrolle</SelectTrigger>
					<SelectContent>
						<SelectItem value="Anwärter">Trainee</SelectItem>
						<SelectItem value="Mitglied">Mitglied</SelectItem>
						<SelectItem value="Alumni">Alumni</SelectItem>
					</SelectContent>
				</Select>
				<Select type="multiple" bind:value={mitgliederFilter.beraterstufe}>
					<SelectTrigger class="w-48">Beraterstufen</SelectTrigger>
					<SelectContent>
						<SelectItem value="Junior Consultant">Junior Consultant</SelectItem>
						<SelectItem value="Consultant">Consultant</SelectItem>
						<SelectItem value="Senior Consultant">Senior Consultant</SelectItem>
						<SelectItem value="Managing Consultant">Managing Consultant</SelectItem>
						<SelectItem value="Director">Director</SelectItem>
						<SelectItem value="Senior Director">Senior Director</SelectItem>
					</SelectContent>
				</Select>

				<div>
					<Input
						type="number"
						placeholder="Generation"
						bind:value={mitgliederFilter.generation}
						class="w-full"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-3">
			{#each $mitglieder.data.pages as page}
				{#each page as mitglied, index}
					<MemberResultItem {mitglied} />
					{#if index === page.length - 4}
						<div
							use:inview
							oninview_change={(mitglied) => {
								const { inView } = mitglied.detail;
								if (inView && !$mitglieder.isLoading) {
									$mitglieder.fetchNextPage();
								}
							}}
						></div>
					{/if}
				{/each}
			{/each}
			{#if $mitglieder.isLoading}
				<div class="text-center py-4">
					<p>Lade weitere Mitglieder...</p>
				</div>
			{:else if $mitglieder.data.pages.length === 0}
				<div class="text-center py-4">
					<p>Keine Mitglieder gefunden.</p>
				</div>
			{/if}
		</div>
	</section>
{/if}
