<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import BudgetPostenRows from '@/components/pages/finanzen/budgetierung/BudgetPostenRows.svelte';
	import KostenstelleTabellenEintrag from '@/components/pages/finanzen/budgetierung/KostenstelleTabellenEintrag.svelte';
	import { writable } from 'svelte/store';

	export let data;

	const expanded = writable<Set<string>>(new Set());
	function toggleExpand(id: string) {
		console.log('toggleExpand', id);
		expanded.update((set) => {
			if (set.has(id)) set.delete(id);
			else set.add(id);
			return set;
		});
	}
</script>

<div class="space-y-4">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Kostenstelle / Budgetposten</Table.Head>
				<Table.Head>Angefragt</Table.Head>
				<Table.Head>Freigegeben</Table.Head>
				<Table.Head>Verbraucht</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.data as kostenstelle}
				<!-- root entry: toggle on click -->
				<KostenstelleTabellenEintrag
					{kostenstelle}
					rank={1}
					on:click={() => toggleExpand(kostenstelle.id)}
				/>
				{#if $expanded.has(kostenstelle.id)}
					{#if kostenstelle.children.length > 0}
						{#each kostenstelle.children as child1}
							<KostenstelleTabellenEintrag
								kostenstelle={child1}
								rank={2}
								on:click={() => toggleExpand(child1.id)}
							/>
							{#if $expanded.has(child1.id)}
								{#if child1.children.length > 0}
									{#each child1.children as child2}
										<KostenstelleTabellenEintrag
											kostenstelle={child2}
											rank={3}
											on:click={() => toggleExpand(child2.id)}
										/>
										{#if $expanded.has(child2.id)}
											<BudgetPostenRows rank={4} kostenstelle={child2} />
										{/if}
									{/each}
								{:else}
									<BudgetPostenRows rank={3} kostenstelle={child1} />
								{/if}
							{/if}
						{/each}
					{:else}
						<BudgetPostenRows rank={2} {kostenstelle} />
					{/if}
				{/if}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
