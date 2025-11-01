<script lang="ts">
	import { writable } from 'svelte/store';
	import BreadcrumbOverride from '$lib/components/general/BreadcrumbOverride.svelte';
	import SchulungMasterDetailsHeader from '$lib/components/pages/schulungen/master/SchulungMasterDetailsHeader.svelte';
	import SchulungInstanceList from '$lib/components/pages/schulungen/master/SchulungInstanceList.svelte';
	import { setSchulungMasterContext } from '$lib/context/schulungMasterContext';

	let { data } = $props();

	const master = writable(data.master);
	setSchulungMasterContext({ master });

	$effect(() => {
		master.set(data.master);
	});
</script>

{#if $master}
	<BreadcrumbOverride segment={String($master.id)} label={$master.name} />
	<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
		<SchulungMasterDetailsHeader />

		<section class="flex w-full flex-col gap-4">
			<h2 class="text-xl font-semibold">Schulungsinstanzen</h2>
			<SchulungInstanceList
				instances={$master.instances}
				linkToDetails
				buttonLabel="Details"
			/>
		</section>
	</div>
{:else}
	<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
		<p class="text-muted-foreground">Schulung Master nicht gefunden.</p>
	</div>
{/if}
