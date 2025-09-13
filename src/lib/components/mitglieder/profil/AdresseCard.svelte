<script>
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
</script>

<Card>
	<CardHeader>
		<CardTitle>Adresse</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-2 text-sm">
			<div>
				<p class="font-medium">Straße & Hausnummer</p>
				<p class="text-muted-foreground">Musterstraße 123</p>
			</div>
			<div>
				<p class="font-medium">PLZ & Ort</p>
				<p class="text-muted-foreground">12345 Musterstadt</p>
			</div>
		</div>
	</CardContent>
</Card>
