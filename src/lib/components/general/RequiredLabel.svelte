<script lang="ts">
	import FormLabel from '../ui/form/form-label.svelte';

	export let required: boolean = false;
	export let label: string;
</script>

<FormLabel
	>{label}
	{#if required}
		<p class="text-red-500" aria-label="required">*</p>
	{/if}
</FormLabel>
