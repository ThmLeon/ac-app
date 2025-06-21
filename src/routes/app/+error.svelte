<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<div class="h-full flex items-center justify-center p-4">
	<Card class="w-full max-w-md text-center">
		<CardHeader>
			<CardTitle class="text-6xl font-bold">Fehler</CardTitle>
		</CardHeader>
		<CardContent>
			<p class="text-lg text-gray-700 font-medium">
				{page.error?.message || 'Ein unerwarteter Fehler ist aufgetreten'}
			</p>

			<div class="mt-6">
				<Button href="/app" class="w-full">Zurück zur Homepage</Button>
			</div>
		</CardContent>
	</Card>
</div>
