<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	type Dienst = {
		id: number;
		datum: string; // e.g. 14.09.2025
		durchgefuehrtVon: string[];
	};

	const dienste: Dienst[] = [
		{ id: 1, datum: '14.09.2025', durchgefuehrtVon: ['Mitglied 1', 'Mitglied 2'] },
		{ id: 2, datum: '21.09.2025', durchgefuehrtVon: ['Mitglied 3'] },
		{ id: 3, datum: '28.09.2025', durchgefuehrtVon: ['Mitglied 4', 'Mitglied 5'] }
	];
</script>

<section class="p-6 space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Bürodienst</h1>
		<Button>Neuen Bürodienst anlegen</Button>
	</div>

	<div class="space-y-3">
		{#each dienste as d}
			<Card>
				<CardHeader class="pb-2">
					<CardTitle>Bürodienst | {d.datum}</CardTitle>
				</CardHeader>
				<CardContent class="flex items-center justify-between gap-4">
					<p class="text-sm text-muted-foreground">
						<span class="font-medium text-foreground">Durchgeführt von:</span>
						{' '}{d.durchgefuehrtVon.join(', ')}
					</p>
					<div class="flex gap-2">
						<a href={`/app/buero/buerodienst/${d.id}`}>
							<Button variant="outline">Details</Button>
						</a>
						<Button variant="default">Abnehmen</Button>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
</section>
