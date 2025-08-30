<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount, setContext } from 'svelte';
	import type { SupabaseClient, Session } from '@supabase/supabase-js';
	import '../app.css';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	// Context object (mutable) so children always see current values
	const supabaseContext: { supabase: SupabaseClient | null; session: Session | null } = {
		supabase: null,
		session: null
	};
	setContext('supabase', supabaseContext);

	// Keep context in sync whenever load data updates
	$effect(() => {
		supabaseContext.supabase = supabase;
		supabaseContext.session = session;
	});

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
