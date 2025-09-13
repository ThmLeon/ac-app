<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatEuro } from '@/utils/utils';
	export let kostenstelle;
	export let rank: number;

	const indent = () => `${rank * 1}rem`;
</script>

{#each kostenstelle.finanzen_budgets as budget}
	<Table.Row>
		<Table.Cell style="padding-left: {indent()}">{budget.name}</Table.Cell>
		<Table.Cell style="padding-left: {indent()}">{formatEuro(budget.betrag_beantragt)}</Table.Cell>
		<Table.Cell style="padding-left: {indent()}">{formatEuro(budget.betrag_freigegeben)}</Table.Cell
		>
		<Table.Cell style="padding-left: {indent()}">{formatEuro(0)}</Table.Cell>
	</Table.Row>
{/each}
