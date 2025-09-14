<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import {
		Root as AlertDialog,
		Content as AlertDialogContent,
		Description as AlertDialogDescription,
		Footer as AlertDialogFooter,
		Header as AlertDialogHeader,
		Title as AlertDialogTitle,
		Cancel as AlertDialogCancel,
		Action as AlertDialogAction
	} from '$lib/components/ui/alert-dialog';

	type MemberBalance = {
		id: number;
		name: string;
		imageUrl?: string | null;
		balance: number; // positive -> Guthaben, negative -> Schulden
	};

	export let member: MemberBalance;
	let confirmDialogOpen = false;

	const initials = member.name
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();

	$: balanceText = `${member.balance.toFixed(2)} € ${member.balance < 0 ? '(Schulden)' : '(Guthaben)'}`;
</script>

<Card>
	<CardContent class="p-4">
		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 min-w-0">
				<Avatar class="h-12 w-12 rounded-lg">
					<AvatarImage src={member.imageUrl ?? undefined} alt={member.name} class="object-cover" />
					<AvatarFallback class="rounded-lg">{initials}</AvatarFallback>
				</Avatar>
				<div class="min-w-0">
					<p class="font-medium truncate">{member.name}</p>
					<p class="text-sm text-muted-foreground">AC-Guthaben: {balanceText}</p>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="outline">+1 Kaffee/Müsli</Button>
				<Button variant="outline">+1 Getränk</Button>
				<Button variant="default" onclick={() => (confirmDialogOpen = true)}
					>Schulden ausgeglichen</Button
				>
			</div>
		</div>

		<!-- Confirm dialog -->
		<AlertDialog bind:open={confirmDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Zahlung wirklich ausgeglichen?</AlertDialogTitle>
					<AlertDialogDescription>
						Bitte bestätige, dass das Geld per PayPal überwiesen wurde.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Nein, mache ich noch</AlertDialogCancel>
					<AlertDialogAction>Ja, schon erledigt</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</CardContent>
</Card>
