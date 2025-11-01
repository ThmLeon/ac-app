<script lang="ts">
	import SchulungMasterList from '$lib/components/pages/schulungen/master/SchulungMasterList.svelte';
	import { schulungenMasters } from '$lib/data/mockSchulungenMasters';
</script>

<div class="container mx-auto p-4">
	<SchulungMasterList {schulungenMasters} />
</div>
