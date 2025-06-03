<script>
    import { page } from '$app/stores';
    
    async function signInWithAzure() {
        const { supabase } = $page.data;
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback',
                scopes: 'openid email profile User.Read',
            },
        });
        
        if (error) {
            console.error('Authentication error:', error);
        }
    }
</script>

<button on:click={signInWithAzure}>
    Sign in with Azure
</button>