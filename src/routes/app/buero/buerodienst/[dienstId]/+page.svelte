<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';

	// Dummy tabs/sections with todos
	type Todo = { id: string; title: string; description: string; done: boolean };
	type Section = { key: string; label: string; todos: Todo[] };

	let sections: Section[] = [
		{
			key: 'kueche',
			label: 'Küche',
			todos: [
				{
					id: 'k1',
					title: 'Arbeitsflächen wischen',
					description: 'Alle Flächen feucht wischen',
					done: false
				},
				{ id: 'k2', title: 'Geschirrspüler', description: 'Leeren und ggf. neu füllen', done: true }
			]
		},
		{
			key: 'bad',
			label: 'Bad',
			todos: [
				{
					id: 'b1',
					title: 'Waschbecken reinigen',
					description: 'Mit Reiniger putzen',
					done: false
				},
				{ id: 'b2', title: 'Boden wischen', description: 'Feucht wischen', done: false }
			]
		},
		{
			key: 'raeume',
			label: 'Räume',
			todos: [
				{ id: 'r1', title: 'Tische abwischen', description: 'Alle Tische', done: true },
				{ id: 'r2', title: 'Müll entsorgen', description: 'Alle Mülleimer leeren', done: false }
			]
		},
		{
			key: 'getraenke',
			label: 'Getränke',
			todos: [
				{
					id: 'g1',
					title: 'Kühlschrank auffüllen',
					description: 'Getränke nachfüllen',
					done: false
				}
			]
		}
	];

	let active = sections[0].key;

	function doneCount(s: Section) {
		return s.todos.filter((t) => t.done).length;
	}
</script>

<section class="p-6 space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold">Bürodienst Details</h1>
		<a href="/app/buero/buerodienst" class="shrink-0"><Button variant="outline">Zurück</Button></a>
	</div>

	<!-- Tabs header (simple button group) -->
	<div class="flex flex-wrap gap-2">
		{#each sections as s}
			<Button
				variant={active === s.key ? 'default' : 'outline'}
				onclick={() => (active = s.key)}
				class="rounded-full"
			>
				{s.label} ({doneCount(s)}/{s.todos.length})
			</Button>
		{/each}
	</div>

	<!-- Active section todos -->
	{#each sections.filter((s) => s.key === active) as sec}
		<Card>
			<CardHeader>
				<CardTitle>{sec.label}</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3">
				{#each sec.todos as todo}
					<label class="flex items-start gap-3">
						<Checkbox bind:checked={todo.done} />
						<div>
							<p class="font-medium">{todo.title}</p>
							<p class="text-sm text-muted-foreground">{todo.description}</p>
						</div>
					</label>
				{/each}
			</CardContent>
		</Card>
	{/each}
</section>
