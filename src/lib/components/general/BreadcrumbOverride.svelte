<script lang="ts">
	import { getContext } from 'svelte';

	let { segment, label }: { segment?: string | number; label?: string } = $props();

	type BreadcrumbCtx = {
		setLabel: (segment: string, label: string) => void;
		clearLabel: (segment: string) => void;
	};
	const breadcrumb = getContext('breadcrumb') as BreadcrumbCtx;

	$effect(() => {
		if (segment != null && label) {
			const seg = String(segment);
			breadcrumb.setLabel(seg, label);
			return () => breadcrumb.clearLabel(seg);
		}
	});
</script>

<!-- This component renders nothing; it just manages breadcrumb overrides. -->
