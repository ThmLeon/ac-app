<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle,
		CardDescription
	} from '../ui/card';
	import { Button } from '../ui/button';
	import { Badge } from '../ui/badge'; // Import the ShadCN badge component
	import { differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale'; // Import German locale for formatting
	import { formatApplicationDeadline, formatDate } from '@/app.utils';

	export let imageUrl: string;
	export let title: string;
	export let description: string;
	export let startDate: string;
	export let endDate: string;
	export let applicationDeadline: string;
	export let masterName: string;
	export let eventId: string;
	export let eventBewerbung: {
		id: string;
		mitglied_id: string;
		besetzt: boolean;
		anwesend: boolean;
	}[];

	let status = () => {
		if (eventBewerbung.length === 0) return 'Offen';
		if (eventBewerbung[0].anwesend) return 'Anwesend';
		if (eventBewerbung[0].besetzt) return 'Besetzt';
		return 'Beworben';
	};
</script>

<Card class="flex flex-col md:flex-row gap-4">
	<!-- Image Section -->
	<img src={imageUrl} alt={title} class="w-full md:w-1/3 h-auto object-cover rounded-lg" />

	<!-- Content Section -->
	<div class="flex flex-1 flex-col justify-between">
		<CardHeader>
			<CardTitle class="text-lg font-bold">{title}</CardTitle>
			<CardDescription class="text-sm text-gray-500">
				{description.length > 100 ? `${description.slice(0, 100)}...` : description}
			</CardDescription>
		</CardHeader>
		<CardContent class="text-sm text-gray-700">
			<p><strong>Beginn:</strong> {formatDate(startDate)}</p>
			<p><strong>Ende:</strong> {formatDate(endDate)}</p>
			<p><strong>Bewerbungsfrist:</strong> {formatApplicationDeadline(applicationDeadline)}</p>
		</CardContent>
		<CardFooter class="flex justify-between items-center">
			<!-- Linke Seite: Badges -->
			<div class="flex gap-2">
				<Badge variant="default">
					{status()}
				</Badge>
				<Badge variant="default">
					{masterName.charAt(0).toUpperCase() + masterName.slice(1)}
				</Badge>
			</div>

			<!-- Rechte Seite: Button -->
			<a href={`./events/${eventId}`}>
				<Button variant="default">Details</Button>
			</a>

			<!-- Navigate to event details -->
		</CardFooter>
	</div>
</Card>
