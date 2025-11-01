<script lang="ts">
	import BreadcrumbOverride from '$lib/components/general/BreadcrumbOverride.svelte';
	import SchulungDetails from '$lib/components/pages/schulungen/detail/SchulungDetails.svelte';

	let { data } = $props();
</script>

{#if data?.instance}
	<BreadcrumbOverride segment={String(data.instance.id)} label={data.instance.name} />
	<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
		<SchulungDetails instance={data.instance} master={data.master} />
	</div>
{:else}
	<div class="mx-auto flex w-full flex-col gap-6 px-4 pb-6">
		<p class="text-muted-foreground">Schulung konnte nicht geladen werden.</p>
	</div>
{/if}
