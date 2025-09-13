<script>
	export let data; // Use the `data` prop passed from the load function

	async function signInWithAzure() {
		const { supabase } = data; // Access supabase from the `data` prop

		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'azure',
			options: {
				// use environment variable in production
				redirectTo: process.env.BASE_URL + '/auth/callback',
				scopes: 'openid email profile User.Read'
			}
		});

		if (error) {
			console.error('Authentication error:', error);
		}
	}
</script>

<div class="flex flex-col items-center justify-center h-screen bg-[#993333] text-white text-center">
	<img
		src="https://academyconsult.de/wp-content/uploads/2023/11/aclogo.jpg"
		alt="AC Logo"
		class="w-60 h-60 mb-4"
	/>
	<button
		class="px-6 py-3 text-[#993333] bg-white rounded-lg font-bold hover:bg-gray-200"
		on:click={signInWithAzure}
	>
		Microsoft Login
	</button>
</div>
