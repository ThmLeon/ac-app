<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
	import * as Chart from '$lib/components/ui/chart/index.js';
	import { BarChart } from 'layerchart';

	const chartData = [
		{ date: '2024-08-04', passivscore: 45 },
		{ date: '2024-08-11', passivscore: 52 },
		{ date: '2024-08-18', passivscore: 38 },
		{ date: '2024-08-25', passivscore: 61 },
		{ date: '2024-09-01', passivscore: 47 },
		{ date: '2024-09-08', passivscore: 55 },
		{ date: '2024-09-15', passivscore: 42 },
		{ date: '2024-09-22', passivscore: 58 },
		{ date: '2024-09-29', passivscore: 49 },
		{ date: '2024-10-06', passivscore: 63 },
		{ date: '2024-10-13', passivscore: 41 },
		{ date: '2024-10-20', passivscore: 56 },
		{ date: '2024-10-27', passivscore: 44 },
		{ date: '2024-11-03', passivscore: 59 },
		{ date: '2024-11-10', passivscore: 46 },
		{ date: '2024-11-17', passivscore: 53 },
		{ date: '2024-11-24', passivscore: 40 },
		{ date: '2024-12-01', passivscore: 62 },
		{ date: '2024-12-08', passivscore: 48 },
		{ date: '2024-12-15', passivscore: 57 },
		{ date: '2024-12-22', passivscore: 43 },
		{ date: '2024-12-29', passivscore: 60 },
		{ date: '2025-01-05', passivscore: 45 },
		{ date: '2025-01-12', passivscore: 54 },
		{ date: '2025-01-19', passivscore: 39 },
		{ date: '2025-01-26', passivscore: 61 },
		{ date: '2025-02-02', passivscore: 47 },
		{ date: '2025-02-09', passivscore: 56 },
		{ date: '2025-02-16', passivscore: 42 },
		{ date: '2025-02-23', passivscore: 58 },
		{ date: '2025-03-02', passivscore: 49 },
		{ date: '2025-03-09', passivscore: 63 },
		{ date: '2025-03-16', passivscore: 41 },
		{ date: '2025-03-23', passivscore: 55 },
		{ date: '2025-03-30', passivscore: 44 },
		{ date: '2025-04-06', passivscore: 59 },
		{ date: '2025-04-13', passivscore: 46 },
		{ date: '2025-04-20', passivscore: 52 },
		{ date: '2025-04-27', passivscore: 40 },
		{ date: '2025-05-04', passivscore: 62 },
		{ date: '2025-05-11', passivscore: 48 },
		{ date: '2025-05-18', passivscore: 57 },
		{ date: '2025-05-25', passivscore: 43 },
		{ date: '2025-06-01', passivscore: 60 },
		{ date: '2025-06-08', passivscore: 45 },
		{ date: '2025-06-15', passivscore: 54 },
		{ date: '2025-06-22', passivscore: 39 },
		{ date: '2025-06-29', passivscore: 61 },
		{ date: '2025-07-06', passivscore: 47 },
		{ date: '2025-07-13', passivscore: 56 },
		{ date: '2025-07-20', passivscore: 42 },
		{ date: '2025-07-27', passivscore: 58 },
		{ date: '2025-08-03', passivscore: 51 }
	];
	const chartConfig = {
		passivscore: {
			label: 'Passivscore',
			color: '#2563eb'
		}
	} satisfies Chart.ChartConfig;
</script>

<Card class="col-span-2">
	<CardHeader>
		<CardTitle>Passivscore</CardTitle>
	</CardHeader>
	<CardContent>
		<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
			<BarChart
				data={chartData}
				x="date"
				axis="x"
				seriesLayout="group"
				tooltip={false}
				series={[
					{
						key: 'passivscore',
						label: chartConfig.passivscore.label,
						color: chartConfig.passivscore.color
					}
				]}
			/>
		</Chart.Container>
	</CardContent>
</Card>
