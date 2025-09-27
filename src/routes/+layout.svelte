<script lang="ts">
	import { invalidate } from '$app/navigation';
        import { onMount } from 'svelte';
        import { initSharepointClient } from '@/client/sharepoint/sharepointClient';
        import '../app.css';

        let { data, children } = $props();
        let { supabase, session } = $derived(data);

        onMount(() => {
                const {
                        data: { subscription }
                } = supabase.auth.onAuthStateChange((event, _session) => {
                        if (_session?.expires_at !== session?.expires_at) {
                                invalidate('supabase:auth');
                        }
                });

                const stopSharepoint = initSharepointClient(supabase);

                return () => {
                        subscription.unsubscribe();
                        stopSharepoint();
                };
        });
</script>

{@render children()}
