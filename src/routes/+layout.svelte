<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount, setContext } from 'svelte';
	import type { SupabaseClient, Session } from '@supabase/supabase-js';
	import '../app.css';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
