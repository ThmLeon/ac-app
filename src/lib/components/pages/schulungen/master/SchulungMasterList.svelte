<script lang="ts">
	import SchulungMasterCard from '$lib/components/schulungen/SchulungMasterCard.svelte';
	import type { SchulungMaster } from '$lib/data/mockSchulungenMasters';

	export let schulungenMasters: SchulungMaster[];
</script>

<div class="flex flex-wrap justify-start gap-4">
	{#each schulungenMasters as schulungMaster (schulungMaster.id)}
		<div class="flex justify-center">
			<SchulungMasterCard {schulungMaster} />
		</div>
	{/each}
</div>
