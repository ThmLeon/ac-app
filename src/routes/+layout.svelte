<script lang="ts">
        import { browser } from '$app/environment';
        import { invalidate } from '$app/navigation';
        import { onMount, setContext } from 'svelte';
        import '../app.css';
        import { createSharepointClientStore } from '@/api/sharepoint/sharepointClient';

        let { data, children } = $props();
        let { supabase, session } = $derived(data);

        let sharepointClientStore;

        $: if (browser && supabase && !sharepointClientStore) {
                sharepointClientStore = createSharepointClientStore(supabase);
                setContext('sharepointClient', sharepointClientStore);
        }

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
