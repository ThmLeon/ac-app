<script>
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
</script>

<Card>
	<CardHeader>
		<CardTitle>Kontaktdaten</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-2 text-sm">
			<div>
				<p class="font-medium">Mobil:</p>
				<p class="text-muted-foreground">+49 987 654321</p>
			</div>
			<div>
				<p class="font-medium">AC E-Mail:</p>
				<p class="text-muted-foreground">max.mustermann@academyconsult.de</p>
			</div>
			<div>
				<p class="font-medium">Private E-Mail:</p>
				<p class="text-muted-foreground">max.mustermann@example.com</p>
			</div>

			<div>
				<p class="font-medium">LinkedIn:</p>
				<p class="text-muted-foreground">linkedin.com/in/max-mustermann</p>
			</div>
		</div>
	</CardContent>
</Card>
