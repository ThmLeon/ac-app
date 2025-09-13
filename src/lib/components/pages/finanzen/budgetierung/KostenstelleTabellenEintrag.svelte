<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatEuro } from '@/utils/utils';
	import { createEventDispatcher } from 'svelte';
	export let kostenstelle;
	export let rank: number;

	const boldness = () => {
		if (rank == 1) return 'bold';
		if (rank == 2) return 'semibold';
		return 'medium';
	};

	// für Einrückung je Ebene
	const indent = () => `${rank * 1}rem`;

	const dispatch = createEventDispatcher();
	function handleClick() {
		dispatch('click');
	}
</script>

<Table.Row onclick={handleClick}>
	<Table.Cell class="font-{boldness()}" style="padding-left: {indent()}">
		{kostenstelle.name}
	</Table.Cell>
	<Table.Cell class="font-{boldness()}" style="padding-left: {indent()}"
		>{formatEuro(kostenstelle.totalBetragBeantragt)}</Table.Cell
	>
	<Table.Cell class="font-{boldness()}" style="padding-left: {indent()}"
		>{formatEuro(kostenstelle.totalBetragFreigegeben)}</Table.Cell
	>
	<Table.Cell class="font-{boldness()}" style="padding-left: {indent()}">{formatEuro(0)}</Table.Cell
	>
</Table.Row>
