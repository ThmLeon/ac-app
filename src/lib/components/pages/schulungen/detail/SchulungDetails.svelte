<script lang="ts">
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '$lib/components/ui/card';
import { Badge } from '$lib/components/ui/badge';
import { Button } from '$lib/components/ui/button';
import MitgliedCard from '$lib/components/general/MitgliedCard.svelte';
import teamsLogo from '$lib/assets/microsoft-teams.png?url';
import type {
	SchulungInstance,
	SchulungInstanceFeedback,
	SchulungMaster,
	SchulungType
} from '$lib/data/mockSchulungenMasters';

type ParticipantView = 'besetzt' | 'anwesend' | 'bewerbungen';
type DonutSegment = {
	label: string;
	value: number;
	color: string;
	percentage: number;
};

const props = $props<{ instance: SchulungInstance; master: SchulungMaster }>();

let instance = $state<SchulungInstance>(props.instance);
let master = $state<SchulungMaster>(props.master);

$effect(() => {
	instance = props.instance;
	master = props.master;
});

const typeBadgeClasses: Record<SchulungType, string> = {
	Basisschulung: 'bg-blue-100 text-blue-800',
	Wahlschulung: 'bg-purple-100 text-purple-800'
};

const participantViews: ParticipantView[] = ['besetzt', 'anwesend', 'bewerbungen'];
const participantLabels: Record<ParticipantView, string> = {
	besetzt: 'Besetzt',
	anwesend: 'Anwesend',
	bewerbungen: 'Bewerbungen'
};

const ratingColors = ['#15803d', '#22c55e', '#84cc16', '#facc15', '#f97316', '#ef4444'];

let activeView: ParticipantView = $state('besetzt');

const emptyFeedback: SchulungInstanceFeedback = {
	satisfaction: { satisfied: 0, neutral: 0, unsatisfied: 0 },
	topics: [],
	positives: [],
	improvements: []
};

let feedback = $state<SchulungInstanceFeedback>(props.instance.feedback ?? emptyFeedback);

$effect(() => {
	feedback = instance.feedback ?? emptyFeedback;
});

let satisfactionTotals = $state(emptyFeedback.satisfaction);
let donutTotal = $state(0);
let donutSegments = $state<DonutSegment[]>([]);
let donutGradient = $state('var(--muted)');
let topicFeedback = $state<SchulungInstanceFeedback['topics']>([]);
let positiveFeedback = $state<string[]>([]);
let improvementFeedback = $state<string[]>([]);

$effect(() => {
	const next =
		participantViews.find((view) => (instance.participants?.[view]?.length ?? 0) > 0) ?? 'besetzt';
	activeView = next;
});


$effect(() => {
	satisfactionTotals = feedback.satisfaction;
	const total =
		satisfactionTotals.satisfied + satisfactionTotals.neutral + satisfactionTotals.unsatisfied;
	donutTotal = total;

	if (!total) {
		donutSegments = [];
		donutGradient = 'var(--muted)';
	} else {
		const base: DonutSegment[] = [
			{
				label: 'Zufrieden',
				value: satisfactionTotals.satisfied,
				color: '#16a34a',
				percentage: 0
			},
			{
				label: 'Neutral',
				value: satisfactionTotals.neutral,
				color: '#f59e0b',
				percentage: 0
			},
			{
				label: 'Unzufrieden',
				value: satisfactionTotals.unsatisfied,
				color: '#dc2626',
				percentage: 0
			}
		];

		let currentAngle = 0;
		const stops: string[] = [];
		donutSegments = base.map((segment) => {
			const portion = total ? (segment.value / total) * 100 : 0;
			const angle = (portion / 100) * 360;
			const start = currentAngle;
			const end = currentAngle + angle;
			currentAngle = end;
			stops.push(`${segment.color} ${start}deg ${end}deg`);
			return {
				...segment,
				percentage: portion
			};
		});
		donutGradient = stops.length ? `conic-gradient(${stops.join(', ')})` : 'var(--muted)';
	}

	topicFeedback = feedback.topics;
	positiveFeedback = feedback.positives;
	improvementFeedback = feedback.improvements;
});

function participantsFor(view: ParticipantView) {
	return instance.participants?.[view] ?? [];
}
</script>

<div class="flex flex-col gap-6">
	<Card class="w-full">
		<CardHeader class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
			<div class="space-y-2">
				<div class="flex flex-wrap items-center gap-2">
					<CardTitle class="text-2xl font-semibold">{instance.name}</CardTitle>
					<Badge class={typeBadgeClasses[master.type]}>{master.type}</Badge>
				</div>
				<CardDescription class="text-base text-foreground">
					{instance.date}
					{#if instance.time}
						<span class="mx-1 text-muted-foreground">·</span>
						{instance.time}
					{/if}
				</CardDescription>
			</div>
			<div class="flex flex-wrap gap-2">
				<Button
					href={master.teamsWorkspaceUrl}
					variant="secondary"
					class="inline-flex items-center gap-2"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={teamsLogo} alt="" class="h-5 w-5 object-contain" />
					<span>Teams Workspace öffnen</span>
				</Button>
				<Button type="button" variant="outline">
					Check-In öffnen
				</Button>
			</div>
		</CardHeader>
		<CardContent>
			<p class="text-sm text-muted-foreground leading-relaxed">{instance.description}</p>
		</CardContent>
	</Card>

	<Card class="w-full">
		<CardHeader>
			<CardTitle class="text-xl font-semibold">Schulungsleitungen</CardTitle>
			<CardDescription>
				Das Team, das die Schulung vorbereitet und durchführt.
			</CardDescription>
		</CardHeader>
		<CardContent>
			{#if instance.leaders.length === 0}
				<p class="text-sm text-muted-foreground">Noch keine Schulungsleitungen zugewiesen.</p>
			{:else}
				<div class="flex flex-wrap gap-4">
					{#each instance.leaders as leader (leader.id)}
						<div class="shrink-0">
							<MitgliedCard
								name={leader.name}
								imageUrl={leader.imageUrl}
								art={leader.art}
								rolle={leader.rolle}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>

	<Card class="w-full">
		<CardHeader class="gap-4">
			<div class="flex flex-wrap items-center gap-2">
				<CardTitle class="text-xl font-semibold">Teilnehmende</CardTitle>
				<CardDescription>
					Wähle aus, welche Gruppe angezeigt werden soll.
				</CardDescription>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each participantViews as view}
					<Button
						type="button"
						variant={activeView === view ? 'default' : 'outline'}
						onclick={() => {
							activeView = view;
						}}
						class="capitalize"
					>
						{participantLabels[view]}
					</Button>
				{/each}
			</div>
		</CardHeader>
		<CardContent>
			{#if participantsFor(activeView).length === 0}
				<p class="text-sm text-muted-foreground">
					In dieser Kategorie sind derzeit keine Mitglieder erfasst.
				</p>
			{:else}
				<div class="flex flex-wrap gap-4">
					{#each participantsFor(activeView) as member (member.id)}
						<div class="shrink-0">
							<MitgliedCard
								name={member.name}
								imageUrl={member.imageUrl}
								art={member.art}
								rolle={member.rolle}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>

	<Card class="w-full">
		<CardHeader>
			<CardTitle class="text-xl font-semibold">Zufriedenheit der Teilnehmenden</CardTitle>
			<CardDescription>
				Aufteilung der Rückmeldungen nach Zufriedenheitsgrad.
			</CardDescription>
		</CardHeader>
		<CardContent>
			{#if donutTotal === 0}
				<p class="text-sm text-muted-foreground">
					Es liegen noch keine Zufriedenheitswerte vor.
				</p>
			{:else}
				<div class="flex flex-wrap items-center gap-6">
					<div class="relative h-36 w-36">
						<div
							class="absolute inset-0 rounded-full"
							style={`background: ${donutGradient};`}
						></div>
						<div
							class="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-lg font-semibold text-foreground shadow-sm"
						>
							{donutTotal}
						</div>
					</div>
					<ul class="space-y-2">
						{#each donutSegments as segment}
							<li class="flex items-center gap-3 text-sm text-muted-foreground">
								<span
									class="inline-block h-3 w-3 rounded-full"
									style={`background:${segment.color};`}
								></span>
								<span>
									{segment.label}:{' '}
									<span class="font-medium text-foreground">{segment.value}</span>
									<span class="ml-1 text-xs text-muted-foreground">
										({Math.round(segment.percentage)}%)
									</span>
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</CardContent>
	</Card>

	<Card class="w-full">
		<CardHeader>
			<CardTitle class="text-xl font-semibold">Bewertung einzelner Aspekte</CardTitle>
			<CardDescription>
				Verteilung der vergebenen Noten sowie Durchschnittswerte je Kriterium.
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if topicFeedback.length === 0}
				<p class="text-sm text-muted-foreground">
					Es liegen noch keine Bewertungen für einzelne Themen vor.
				</p>
			{:else}
				{#each topicFeedback as topic (topic.topic)}
					<div class="space-y-3 rounded-lg border p-4">
						<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
							<h3 class="text-sm font-semibold text-foreground">{topic.topic}</h3>
							<span class="text-sm text-muted-foreground">
								Durchschnittsnote:{' '}
								<span class="font-semibold text-foreground">
									{topic.average.toFixed(1)}
								</span>
							</span>
						</div>
						<div class="flex h-4 w-full overflow-hidden rounded-full border">
							{#each topic.distribution as value, index}
								<div
									class="h-full"
									style={`background:${ratingColors[index]};width:${value}%;`}
									aria-label={`Note ${index + 1} ${value}%`}
								></div>
							{/each}
						</div>
						<div class="flex flex-wrap gap-4 text-xs text-muted-foreground">
							{#each topic.distribution as value, index}
								<span>Note {index + 1}: {value}%</span>
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		</CardContent>
	</Card>

	<section class="grid gap-6 lg:grid-cols-2">
		<article class="flex flex-col gap-3">
			<h3 class="text-lg font-semibold">
				Die folgenden Punkte wurden positiv hervorgehoben (zufällige Reihenfolge):
			</h3>
			{#if positiveFeedback.length === 0}
				<p class="text-sm text-muted-foreground">
					Es liegen noch keine positiven Rückmeldungen vor.
				</p>
			{:else}
				<div class="grid gap-3">
					{#each positiveFeedback as entry, index}
						<div class="rounded-lg border bg-card p-3 text-sm leading-relaxed text-foreground">
							<strong class="mr-2 text-xs uppercase tracking-wide text-muted-foreground"
								>P{index + 1}</strong
							>
							{entry}
						</div>
					{/each}
				</div>
			{/if}
		</article>

		<article class="flex flex-col gap-3">
			<h3 class="text-lg font-semibold">
				Die folgenden Punkte sind noch ausbaufähig (zufällige Reihenfolge):
			</h3>
			{#if improvementFeedback.length === 0}
				<p class="text-sm text-muted-foreground">
					Es liegen keine Verbesserungsvorschläge vor.
				</p>
			{:else}
				<div class="grid gap-3">
					{#each improvementFeedback as entry, index}
						<div class="rounded-lg border bg-card p-3 text-sm leading-relaxed text-foreground">
							<strong class="mr-2 text-xs uppercase tracking-wide text-muted-foreground"
								>I{index + 1}</strong
							>
							{entry}
						</div>
					{/each}
				</div>
			{/if}
		</article>
	</section>
</div>
