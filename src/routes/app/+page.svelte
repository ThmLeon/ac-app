<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/events', { replaceState: true });
	});
</script>

<h1>Hello world</h1>
