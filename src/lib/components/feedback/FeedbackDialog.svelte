<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
		DialogFooter,
		DialogClose
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { MessageSquare } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { feedbackSchema, feedbackCategories, type FeedbackForm } from '@/schemas/feedbackSchema';
	import { toast } from 'svelte-sonner';
	import { handleActionResultSonners } from '@/app.utils';
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';

	const { form: initialForm } = $props<{ form: SuperValidated<FeedbackForm> }>();

	const form = superForm(initialForm, {
		validators: zodClient(feedbackSchema),
		dataType: 'json',
		onSubmit: () => {
			toast.loading('Feedback wird gesendet', { id: 'feedback_form' });
		},
		onResult: ({ result }) => {
			handleActionResultSonners(result, 'feedback_form');
			if (result.type === 'success') {
				open = false;
			}
		}
	});

	const formData = form.form;
	let open = false;

	function prepareFeedback() {
		form.reset();
		formData.AppSeite = $page.url.pathname;
	}
</script>

<Dialog bind:open>
	<DialogTrigger asChild>
		<Button
			class="fixed bottom-4 right-4 rounded-full h-12 w-12 p-3 shadow-lg"
			on:click={prepareFeedback}
		>
			<MessageSquare class="h-6 w-6" />
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Feedback geben</DialogTitle>
		</DialogHeader>
		<form method="POST" action="?/sendFeedback" use:form.enhance class="space-y-4">
			<div class="space-y-2">
				<Input name="Titel" placeholder="Titel" bind:value={formData.Titel} />
			</div>
			<div class="space-y-2">
				<input type="hidden" name="Kategorie" value={formData.Kategorie} />
				<Select type="single" bind:value={formData.Kategorie}>
					<SelectTrigger class="w-full">
						{formData.Kategorie || 'Kategorie wählen'}
					</SelectTrigger>
					<SelectContent>
						{#each feedbackCategories as cat}
							<SelectItem value={cat}>{cat}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>
			<div class="space-y-2">
				<Input name="AppSeite" bind:value={formData.AppSeite} />
			</div>
			<div class="space-y-2">
				<Textarea
					name="Beschreibung"
					placeholder="Beschreibung"
					bind:value={formData.Beschreibung}
				/>
			</div>
			<DialogFooter class="flex justify-end gap-2 pt-2">
				<DialogClose asChild>
					<Button type="button" variant="secondary">Abbrechen</Button>
				</DialogClose>
				<Button type="submit">Senden</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
