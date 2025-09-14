<script lang="ts">
	import CardBase from './CardBase.svelte';
	// no additional UI imports needed

	type StageKey =
		| 'junior_consultant'
		| 'consultant'
		| 'senior_consultant'
		| 'managing_consultant'
		| 'director'
		| 'senior_director';

	type StagePeriod = {
		start: string; // ISO date
		end?: string; // ISO date or undefined for ongoing
	};

	type StageInfo = {
		key: StageKey;
		label: string;
		period?: StagePeriod; // present if achieved
	};

	// Props: Supply real data later; defaults for demo
	export let stages: StageInfo[] = [
		{
			key: 'junior_consultant',
			label: 'Junior Consultant',
			period: { start: '2023-11-06', end: '2024-04-15' }
		},
		{ key: 'consultant', label: 'Consultant', period: { start: '2024-04-16' } }, // ongoing
		{ key: 'senior_consultant', label: 'Senior Consultant' },
		{ key: 'managing_consultant', label: 'Managing Consultant' },
		{ key: 'director', label: 'Director' },
		{ key: 'senior_director', label: 'Senior Director' }
	];

	const colorAchieved = '#993333';

	function formatDate(d: Date) {
		return new Intl.DateTimeFormat('de-DE').format(d);
	}

	function calcDays(start: Date, end: Date) {
		const ms = end.getTime() - start.getTime();
		return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
	}

	function periodText(p?: StagePeriod) {
		if (!p) return '';
		const s = new Date(p.start);
		const e = p.end ? new Date(p.end) : new Date();
		const days = calcDays(s, e);
		return `${formatDate(s)} - ${p.end ? formatDate(e) : 'Heute'}\n${days} Tage`;
	}
</script>

<CardBase title="Beraterstufe">
	<div class="w-full overflow-x-auto">
		<div class="min-w-[720px] flex items-stretch">
			{#each stages as s, i}
				<!-- Arrow item -->
				<div class="relative flex-1 min-w-[120px]">
					<!-- Arrow body -->
					<div
						class="h-24 flex items-center justify-center text-center px-4"
						style="background-color: {s.period ? colorAchieved : 'white'}; color: {s.period
							? 'white'
							: 'black'}; border: 1px solid #eee;"
					>
						<div class="flex flex-col items-center justify-center leading-tight w-full">
							<div class="text-lg font-medium">{s.label}</div>
							{#if s.period}
								<div class="text-sm italic opacity-90 whitespace-pre-line">
									{periodText(s.period)}
								</div>
							{/if}
						</div>
					</div>
					<!-- Arrow head (triangle) except for the last item) -->
					{#if i < stages.length - 1}
						<div class="absolute top-0 right-[-24px] h-full w-6">
							<!-- Triangle using CSS borders -->
							<div
								class="absolute top-0 right-0 h-0 w-0"
								style="border-top: 48px solid transparent; border-bottom: 48px solid transparent; border-left: 24px solid {s.period
									? colorAchieved
									: 'white'};"
							></div>
							<!-- Overlap mask to create seamless connection by covering next item's left border -->
							<div
								class="absolute top-0 right-[-1px] h-full w-[1px]"
								style="background-color: {s.period ? colorAchieved : 'white'}"
							></div>
						</div>
					{/if}
					<!-- Notch on left to make arrows interlock (except first) -->
					{#if i > 0}
						<div class="absolute top-0 left-0 h-full w-6 overflow-hidden" aria-hidden="true">
							<div
								class="absolute top-0 left-[-24px] h-0 w-0"
								style="border-top: 48px solid transparent; border-bottom: 48px solid transparent; border-right: 24px solid {stages[
									i - 1
								].period
									? colorAchieved
									: 'white'};"
							></div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</CardBase>
