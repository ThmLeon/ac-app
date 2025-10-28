<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	let query = '';
</script>

<Card class="p-6">
	<CardContent class="p-0">
		<div class="flex flex-col sm:flex-row gap-2 sm:items-center">
			<label class="sr-only" for="mitglied-suche">Mitgliedersuche</label>
			<Input
				id="mitglied-suche"
				placeholder="Mitglieder suchen..."
				bind:value={query}
				class="w-full sm:w-80"
			/>
			<a href="/app/mitglieder/mitgliedersuche" class="shrink-0">
				<Button variant="outline">Erweiterte Suche</Button>
			</a>
		</div>
	</CardContent>
</Card>
