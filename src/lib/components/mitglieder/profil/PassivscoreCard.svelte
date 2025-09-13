<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { BarChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { type ChartContextValue, Highlight } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	import ChartContainer from '@/components/ui/chart/chart-container.svelte';
	import Label from '@/components/ui/label/label.svelte';

	const chartData = [
		{ date: new Date('2024-04-01'), passivscore: 0 },
		{ date: new Date('2024-04-02'), passivscore: 0 },
		{ date: new Date('2024-05-13'), passivscore: 0 },
		{ date: new Date('2024-05-14'), passivscore: 0 },
		{ date: new Date('2024-05-15'), passivscore: 0 },
		{ date: new Date('2024-05-16'), passivscore: 0 },
		{ date: new Date('2024-05-17'), passivscore: 20 },
		{ date: new Date('2024-05-18'), passivscore: 20 },
		{ date: new Date('2024-05-19'), passivscore: 20 },
		{ date: new Date('2024-05-20'), passivscore: 20 },
		{ date: new Date('2024-05-21'), passivscore: 40 },
		{ date: new Date('2024-05-22'), passivscore: 40 },
		{ date: new Date('2024-05-23'), passivscore: 80 },
		{ date: new Date('2024-05-24'), passivscore: 80 },
		{ date: new Date('2024-05-25'), passivscore: 40 },
		{ date: new Date('2024-05-26'), passivscore: 40 },
		{ date: new Date('2024-05-27'), passivscore: 10 },
		{ date: new Date('2024-05-28'), passivscore: 10 },
		{ date: new Date('2024-05-29'), passivscore: 0 },
		{ date: new Date('2024-05-30'), passivscore: 0 },
		{ date: new Date('2024-05-31'), passivscore: 0 },
		{ date: new Date('2024-06-01'), passivscore: 0 },
		{ date: new Date('2024-06-02'), passivscore: 0 },
		{ date: new Date('2024-06-03'), passivscore: 20 },
		{ date: new Date('2024-06-04'), passivscore: 20 },
		{ date: new Date('2024-06-05'), passivscore: 20 },
		{ date: new Date('2024-06-06'), passivscore: 20 },
		{ date: new Date('2024-06-07'), passivscore: 80 },
		{ date: new Date('2024-06-08'), passivscore: 80 },
		{ date: new Date('2024-06-09'), passivscore: 80 },
		{ date: new Date('2024-06-10'), passivscore: 20 },
		{ date: new Date('2024-06-11'), passivscore: 20 },
		{ date: new Date('2024-06-12'), passivscore: 20 },
		{ date: new Date('2024-06-13'), passivscore: 60 },
		{ date: new Date('2024-06-14'), passivscore: 60 },
		{ date: new Date('2024-06-15'), passivscore: 80 },
		{ date: new Date('2024-06-16'), passivscore: 80 },
		{ date: new Date('2024-06-17'), passivscore: 60 },
		{ date: new Date('2024-06-18'), passivscore: 60 },
		{ date: new Date('2024-06-19'), passivscore: 121 },
		{ date: new Date('2024-06-20'), passivscore: 121 },
		{ date: new Date('2024-06-21'), passivscore: 121 },
		{ date: new Date('2024-06-22'), passivscore: 121 },
		{ date: new Date('2024-06-23'), passivscore: 80 },
		{ date: new Date('2024-06-24'), passivscore: 80 },
		{ date: new Date('2024-06-25'), passivscore: 80 },
		{ date: new Date('2024-06-26'), passivscore: 60 },
		{ date: new Date('2024-06-27'), passivscore: 60 },
		{ date: new Date('2024-06-28'), passivscore: 20 },
		{ date: new Date('2024-06-29'), passivscore: 20 },
		{ date: new Date('2024-06-30'), passivscore: 0 },
		{ date: new Date('2024-06-31'), passivscore: 0 }
	];

	const chartConfig = {
		passivscore: {
			label: 'Passivscore',
			color: '#993333'
		}
	} satisfies Chart.ChartConfig;

	const series = [
		{
			key: 'passivscore',
			label: chartConfig.passivscore.label,
			color: chartConfig.passivscore.color,
			component: BarChart // Specify the component for the series
		}
	];
</script>

<Card class="col-span-2">
	<CardHeader>
		<CardTitle>Passivscore</CardTitle>
	</CardHeader>
	<CardContent>
		<ChartContainer config={chartConfig}>
			<BarChart
				data={chartData}
				x="date"
				y="passivscore"
				axis="x"
				labels={{ offset: 12 }}
				{series}
				props={{
					bars: {
						stroke: 'none',
						rounded: 'none'
					},
					highlight: { area: { fill: 'none' } },
					xAxis: {
						format: (d: Date) => {
							return d.toLocaleDateString('de-DE', {
								month: 'short',
								day: '2-digit'
							});
						},
						ticks: (scale) => scaleUtc(scale.domain(), scale.range()).ticks()
					}
				}}
			>
				{#snippet belowMarks()}
					<Highlight area={{ class: 'fill-muted' }} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						nameKey="passivscore"
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('de-DE', {
								month: 'short',
								day: 'numeric',
								year: 'numeric'
							});
						}}
					/>
				{/snippet}
			</BarChart>
		</ChartContainer>
	</CardContent>
</Card>
