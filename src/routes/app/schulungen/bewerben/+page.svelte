<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import SchulungInstanceList from '$lib/components/pages/schulungen/master/SchulungInstanceList.svelte';
	import { schulungenMasters } from '$lib/data/mockSchulungenMasters';

	let maxAssignments = $state(1);

	function increment() {
		maxAssignments += 1;
	}

	function decrement() {
		maxAssignments = Math.max(0, maxAssignments - 1);
	}
</script>

<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
	<section class="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
		<h1 class="text-xl font-semibold">Schulungen Bewerbung</h1>
		<div class="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
			<span class="text-base font-medium">Ich möchte auf maximal</span>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class={buttonVariants({ variant: 'outline', size: 'icon' })}
					onclick={decrement}
					aria-label="Anzahl verringern"
				>
					-
				</button>
				<span
					class="min-w-16 rounded-md bg-primary/10 px-4 py-1 text-center text-2xl font-bold text-primary"
				>
					{maxAssignments}
				</span>
				<button
					type="button"
					class={buttonVariants({ variant: 'outline', size: 'icon' })}
					onclick={increment}
					aria-label="Anzahl erhöhen"
				>
					+
				</button>
			</div>
			<span class="text-base font-medium">Schulungen besetzt werden</span>
		</div>
	</section>

	<section class="flex flex-col gap-4">
		{#each schulungenMasters as master (master.id)}
			<SchulungInstanceList
				instances={master.instances}
				buttonLabel="Bewerben"
				emptyMessage="Derzeit keine Schulungsinstanzen verfügbar."
			/>
		{/each}
	</section>
</div>
