<script lang="ts">
	import { scaleTime } from 'd3-scale';
	import { timeMinute, timeDay } from 'd3-time';
	import { Duration } from 'svelte-ux';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import ChartContainer from '@/components/ui/chart/chart-container.svelte';
	import { BarChart, Tooltip } from 'layerchart';
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card/index.js';

	const chartData = [
		{
			id: 'project-0',
			projectName:
				'Ausarbeitung einer Potenzialanalyse von Kooperationen im Netzwerk Münchner studentischer Initiativen',
			client: 'Academy Consult München e.V.',
			projectType: 'Anwärterprojekt',
			projectStatus: 'Abgeschlossen',
			totalPT: 8.17,
			startDate: new Date('2023-12-20'),
			endDate: new Date('2024-03-26')
		},
		{
			id: 'project-1',
			projectName:
				'Leadgenerierung und Kundenakquise für S&N Invent zur Erschließung neuer Geschäftsfelder',
			client: 'S&N Invent AG',
			projectType: 'Externes Projekt',
			projectStatus: 'Angebot',
			totalPT: 1.18,
			startDate: new Date('2024-11-15'),
			endDate: new Date()
		},
		{
			id: 'project-2',
			projectName:
				'Leadgenerierung und Kundenakquise für S&N Invent zur Erschließung neuer Geschäftsfelder',
			client: 'S&N Invent AG',
			projectType: 'Externes Projekt',
			projectStatus: 'Angebot',
			totalPT: 1.18,
			startDate: new Date('2022-11-15'),
			endDate: new Date('2023-01-01')
		}
	];

	const chartConfig = {
		project: {
			label: 'Projekt',
			color: '#993333'
		}
	} satisfies Chart.ChartConfig;

	// Corrected series configuration
	const series = [
		{
			key: 'project',
			label: chartConfig.project.label, // Fixed typo (Label -> label)
			color: chartConfig.project.color,
			component: BarChart
		}
	];
</script>

<Card class="col-span-2">
	<CardHeader>
		<CardTitle>Projekte</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="relative h-full w-full">
			<ChartContainer config={chartConfig}>
				<BarChart
					data={chartData}
					x={['startDate', 'endDate']}
					xScale={scaleTime()}
					y="id"
					props={{
						bars: {
							fill: chartConfig.project.color, // Explicitly set the bar color
							stroke: 'none',
							rounded: 'none'
						},
						highlight: { area: { fill: 'none' } },
						xAxis: {
							format: (d: Date) => {
								return d.toLocaleDateString('de-DE', {
									month: 'short',
									year: 'numeric'
								});
							},
							ticks: (scale) => {
								const range = scale.range();
								const totalTicks = Math.min(10, Math.floor((range[1] - range[0]) / 100)); // Dynamically calculate ticks
								return typeof scale.ticks === 'function' ? scale.ticks(totalTicks) : [1];
							}
						},
						yAxis: {
							tickLabelProps: {
								width: 250
							}
						}
					}}
					orientation="horizontal"
					padding={{ left: 200, bottom: 36, right: 30 }}
				>
					{#snippet tooltip({ context })}
						<Tooltip.Root {context}>
							{#snippet children({ data })}
								<Tooltip.Header>{data.projectName}</Tooltip.Header>
								<Tooltip.List>
									<Tooltip.Item
										label="Start: "
										value={data.startDate}
										valueAlign="right"
										format="day"
									/>
									<Tooltip.Item
										label="Ende: "
										value={data.endDate}
										valueAlign="right"
										format="day"
									/>
									<Tooltip.Separator />
									<Tooltip.Item label="Dauer: " valueAlign="right">
										<Duration start={data.startDate} end={data.endDate} totalUnits={2} />
									</Tooltip.Item>
								</Tooltip.List>
							{/snippet}
						</Tooltip.Root>
					{/snippet}
				</BarChart>
			</ChartContainer>
		</div>
	</CardContent>
</Card>
