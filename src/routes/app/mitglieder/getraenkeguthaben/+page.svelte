<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import MemberBalanceItem from '$lib/components/pages/mitglieder/getraenkeguthaben/MemberBalanceItem.svelte';

	let nameQuery = '';

	type MemberBalance = {
		id: number;
		name: string;
		imageUrl?: string | null;
		balance: number; // positive -> Guthaben, negative -> Schulden
	};

	const dummyList: MemberBalance[] = [
		{ id: 1, name: 'Max Mustermann', balance: -7.5 },
		{ id: 2, name: 'Erika Mustermann', balance: 3.0 },
		{ id: 3, name: 'Hans Müller', balance: -1.0 }
	];
</script>

<section class="p-6 space-y-6">
	<!-- Search bar -->
	<Card class="p-6">
		<CardContent class="p-0">
			<div class="flex items-center gap-3">
				<label class="sr-only" for="name-search">Name</label>
				<Input
					id="name-search"
					placeholder="Nach Namen suchen..."
					bind:value={nameQuery}
					class="w-full sm:w-96"
				/>
			</div>
		</CardContent>
	</Card>

	<!-- Members list (UI only) -->
	<div class="space-y-3">
		{#each dummyList as member}
			<MemberBalanceItem {member} />
		{/each}
	</div>
</section>
