<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	type Verteiler = {
		id: number;
		title: string;
		description: string;
		subscribed?: boolean;
	};

	export let verteiler: Verteiler;

	let subscribed = verteiler.subscribed ?? false;

	function toggleSubscribe() {
		subscribed = !subscribed;
	}
</script>

<Card class="h-full flex flex-col">
	<CardHeader>
		<CardTitle>{verteiler.title}</CardTitle>
		<CardDescription>{verteiler.description}</CardDescription>
	</CardHeader>
	<CardContent class="mt-auto">
		<div class="flex gap-2">
			<Button onclick={toggleSubscribe} variant={subscribed ? 'outline' : 'default'}>
				{#if subscribed}
					Deabonnieren
				{:else}
					Abonnieren
				{/if}
			</Button>
		</div>
	</CardContent>
</Card>
