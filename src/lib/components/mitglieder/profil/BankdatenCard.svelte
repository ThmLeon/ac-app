<script>
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
</script>

<Card>
	<CardHeader>
		<CardTitle>Bankdaten</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-2 text-sm">
			<div>
				<p class="font-medium">Bank:</p>
				<p class="text-muted-foreground">Musterbank AG</p>
			</div>
			<div>
				<p class="font-medium">IBAN:</p>
				<p class="text-muted-foreground font-mono">DE89 3704 0044 0532 0130 00</p>
			</div>
			<div>
				<p class="font-medium">BIC:</p>
				<p class="text-muted-foreground font-mono">COBADEFFXXX</p>
			</div>
		</div>
	</CardContent>
</Card>
