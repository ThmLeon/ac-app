<script>
	import { Badge } from '@/components/ui/badge';
</script>

<div class="flex flex-col md:flex-row gap-6 mb-4">
	<!-- Profile Image -->
	<div class="flex-shrink-0">
		<img
			src="https://placehold.co/1000x1000"
			alt="Profilbild"
			class="w-48 h-48 rounded-lg object-cover shadow-lg"
		/>
	</div>

	<!-- Basic Info -->
	<div class="flex-1">
		<h1 class="text-3xl font-bold mb-2">Max Mustermann</h1>
		<div class="space-y-2">
			<div class="flex items-center gap-2">
				<Badge variant="secondary">Aktives Mitglied</Badge>
				<Badge variant="secondary">Generation 49</Badge>
			</div>
			<p class="text-lg text-muted-foreground">
				<Badge variant="secondary">Vorstand Finanzen & Recht</Badge>
				<Badge variant="secondary">Budgetierungsbeauftragter</Badge>
				<Badge variant="secondary">Alumnifahrt Orga</Badge>
			</p>
		</div>
	</div>
</div>
